-- QueueLess starter schema. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create type public.app_role as enum ('user','staff','admin');
create type public.appointment_status as enum ('pending','approved','serving','completed','cancelled','rejected','skipped');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now()
);

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  icon text not null default 'Building2',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.departments(id) on delete cascade,
  name text not null,
  duration_minutes int not null default 15 check(duration_minutes between 5 and 240),
  capacity_per_slot int not null default 5 check(capacity_per_slot > 0),
  active boolean not null default true
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  booking_code text not null unique,
  token text not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  department_id uuid not null references public.departments(id),
  service_id uuid not null references public.services(id),
  appointment_date date not null,
  time_slot time not null,
  details text not null default '',
  status public.appointment_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique(user_id, appointment_date, time_slot)
);
create index appointments_date_status_idx on public.appointments(appointment_date,status);
create index appointments_queue_idx on public.appointments(appointment_date,department_id,token);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.current_role()
returns public.app_role language sql stable security definer
set search_path = public
as $$ select role from public.profiles where id = auth.uid() $$;

alter table public.profiles enable row level security;
alter table public.departments enable row level security;
alter table public.services enable row level security;
alter table public.appointments enable row level security;
alter table public.notifications enable row level security;

create policy "profiles read self or staff" on public.profiles for select
using (id = auth.uid() or public.current_role() in ('staff','admin'));
create policy "profiles update self" on public.profiles for update
using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles p where p.id = auth.uid()));
create policy "departments visible" on public.departments for select using (active or public.current_role() in ('staff','admin'));
create policy "departments admin manage" on public.departments for all using (public.current_role()='admin') with check (public.current_role()='admin');
create policy "services visible" on public.services for select using (active or public.current_role() in ('staff','admin'));
create policy "services admin manage" on public.services for all using (public.current_role()='admin') with check (public.current_role()='admin');
create policy "appointments own or staff" on public.appointments for select
using (user_id=auth.uid() or public.current_role() in ('staff','admin'));
create policy "appointments create own" on public.appointments for insert with check (user_id=auth.uid());
create policy "appointments update own pending" on public.appointments for update
using (user_id=auth.uid() and status in ('pending','approved'))
with check (user_id=auth.uid() and status in ('pending','cancelled'));
create policy "staff manage appointments" on public.appointments for update
using (public.current_role() in ('staff','admin')) with check (public.current_role() in ('staff','admin'));
create policy "notifications own read" on public.notifications for select using (user_id=auth.uid());
create policy "notifications own update" on public.notifications for update using (user_id=auth.uid()) with check (user_id=auth.uid());

-- Create profile after signup; role is always user (never accept role from client).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public
as $$ begin
  insert into public.profiles(id,full_name,phone,role)
  values(new.id, coalesce(new.raw_user_meta_data->>'full_name',''), new.raw_user_meta_data->>'phone', 'user');
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Seed departments (safe to re-run).
insert into public.departments(name,description,icon) values
('University Administration','Certificates, records and general university services','Building2'),
('Admissions Office','Applications, admission status and guidance','GraduationCap'),
('Examination Office','Results, transcripts and examination matters','BookOpen'),
('Student Affairs','Student support, cards and campus guidance','Users'),
('Finance Department','Fee vouchers, payments and financial queries','Wallet'),
('General Consultation','General information and front-desk support','MessageCircle')
on conflict do nothing;

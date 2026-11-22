# QueueLess

A responsive multi-page appointment and queue management SaaS starter, created by Fiza. It runs immediately in **Demo Mode** with persistent browser storage, and includes a Supabase schema/policy starter for a real backend.

## Run locally
1. Install Node.js 18+.
2. Extract this folder and run `npm install`.
3. Copy `.env.example` to `.env`.
4. Keep `VITE_DEMO_MODE=true` for a zero-credential demo.
5. Run `npm run dev` and open the URL shown by Vite.

## Demo accounts
- User: `fiza@example.com` / any password (demo only)
- Admin: `admin@queueless.demo` / any password (demo only)
- Registration supports user accounts. The admin identity is seeded by configuration and cannot be created through public registration.

Demo authentication is a usability simulation, **not secure authentication**. Do not use real personal data or deploy demo mode as a production identity system. Demo data is stored in that browser's localStorage and is not shared across devices.

## Supabase setup
1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL Editor.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`.
4. Set `VITE_DEMO_MODE=false`.
5. Enable Email auth in Supabase. Create your administrator using the Supabase dashboard, then promote the corresponding `profiles` row to `admin` using the SQL editor (never expose a service-role key in the browser).
6. Configure redirect URLs for your local and deployed domains.

The included SQL enables RLS and protects profile roles from ordinary users. Review policies, rate limits, backups, email confirmation, and operational procedures before production launch. For queue mutations, use a Postgres function/RPC or trusted server/Edge Function with transactional locking; the demo client-side queue is illustrative.

## Features
- Separate routes for marketing, account, user workspace, and admin workspace
- Demo sign-in/register, role-aware navigation and protected pages
- Booking with date/time selection, duplicate-slot checks, unique booking IDs and queue tokens
- Appointment list, cancellation, rescheduling and live queue view (local demo refresh)
- Department/service catalogue and admin queue/appointment/user/department controls
- CSV export, dashboard charts, profile preferences and notifications
- Command-based voice assistant using browser Web Speech APIs where supported
- Light/dark theme, responsive layouts, empty/loading/error states

## Deployment
Deploy the repository to Netlify. Build command: `npm run build`; publish directory: `dist`. `netlify.toml` includes the SPA fallback required for refreshing nested routes.

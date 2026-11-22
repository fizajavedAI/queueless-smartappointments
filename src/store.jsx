import React,{createContext,useContext,useEffect,useMemo,useState} from 'react';
import {seedAppointments,seedDepartments} from './data';
const StoreContext=createContext(null);
const read=(key,fallback)=>{try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback}catch{return fallback}};
export function StoreProvider({children}){
 const [users,setUsers]=useState(()=>read('ql_users',[{name:'Fiza Javed',email:'fiza@example.com',phone:'03001234567',role:'user'},{name:'QueueLess Admin',email:import.meta.env.VITE_DEMO_ADMIN_EMAIL||'admin@queueless.demo',phone:'',role:'admin'}]));
 const [appointments,setAppointments]=useState(()=>read('ql_appointments',seedAppointments));
 const [departments,setDepartments]=useState(()=>read('ql_departments',seedDepartments));
 const [notifications,setNotifications]=useState(()=>read('ql_notifications',[{id:1,title:'Welcome to QueueLess',body:'Your smart appointment space is ready.',read:false,date:new Date().toISOString()}]));
 const [user,setUser]=useState(()=>read('ql_session',null));
 const [theme,setTheme]=useState(()=>read('ql_theme','light'));
 useEffect(()=>localStorage.setItem('ql_users',JSON.stringify(users)),[users]);
 useEffect(()=>localStorage.setItem('ql_appointments',JSON.stringify(appointments)),[appointments]);
 useEffect(()=>localStorage.setItem('ql_departments',JSON.stringify(departments)),[departments]);
 useEffect(()=>localStorage.setItem('ql_notifications',JSON.stringify(notifications)),[notifications]);
 useEffect(()=>{user?localStorage.setItem('ql_session',JSON.stringify(user)):localStorage.removeItem('ql_session')},[user]);
 useEffect(()=>{localStorage.setItem('ql_theme',JSON.stringify(theme));document.documentElement.dataset.theme=theme},[theme]);
 const notify=(title,body)=>setNotifications(n=>[{id:Date.now(),title,body,read:false,date:new Date().toISOString()},...n]);
 const login=(email)=>{const found=users.find(u=>u.email.toLowerCase()===email.toLowerCase());if(!found)throw Error('No demo account found. Register first.');setUser(found);return found};
 const register=(data)=>{if(users.some(u=>u.email.toLowerCase()===data.email.toLowerCase()))throw Error('An account with this email already exists.');const created={...data,role:'user'};setUsers(u=>[...u,created]);setUser(created);return created};
 const logout=()=>setUser(null);
 const book=(data)=>{const duplicate=appointments.some(a=>a.date===data.date&&a.time===data.time&&a.department===data.department&&['pending','approved','serving'].includes(a.status));if(duplicate)throw Error('That time slot is already booked. Please choose another.');const booking={...data,id:'QL-'+Math.floor(100000+Math.random()*900000),token:(data.department.slice(0,1).toUpperCase())+'-'+String(appointments.filter(a=>a.date===data.date&&a.department===data.department).length+1).padStart(3,'0'),userEmail:user.email,userName:user.name,status:'pending',createdAt:new Date().toISOString()};setAppointments(a=>[booking,...a]);notify('Booking received',`Your booking ${booking.id} is awaiting confirmation.`);return booking};
 const updateAppointment=(id,patch)=>setAppointments(a=>a.map(x=>x.id===id?{...x,...patch}:x));
 const value=useMemo(()=>({users,setUsers,appointments,setAppointments,departments,setDepartments,notifications,setNotifications,user,setUser,theme,setTheme,login,register,logout,book,updateAppointment,notify}),[users,appointments,departments,notifications,user,theme]);
 return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
export const useStore=()=>useContext(StoreContext);
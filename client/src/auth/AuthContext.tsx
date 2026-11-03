import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import api from '../lib/api';
export type AuthUser = { id:number; name:string; email:string };
type AuthContextValue = { user:AuthUser|null; loading:boolean; login:(email:string,password:string)=>Promise<void>; register:(name:string,email:string,password:string)=>Promise<void>; logout:()=>void };
const AuthContext=createContext<AuthContextValue|null>(null);
const TOKEN_KEY='ledgr_token', USER_KEY='ledgr_user';
export function AuthProvider({children}:{children:ReactNode}) {
 const [user,setUser]=useState<AuthUser|null>(()=>{try{const raw=localStorage.getItem(USER_KEY);return raw?JSON.parse(raw) as AuthUser:null;}catch{return null;}});
 const [loading,setLoading]=useState(true);
 useEffect(()=>{if(!localStorage.getItem(TOKEN_KEY)){setLoading(false);return;}api.get('/auth/me').then(r=>{setUser(r.data.user);localStorage.setItem(USER_KEY,JSON.stringify(r.data.user));}).catch(()=>{localStorage.removeItem(TOKEN_KEY);localStorage.removeItem(USER_KEY);setUser(null);}).finally(()=>setLoading(false));},[]);
 const save=(d:{token:string;user:AuthUser})=>{localStorage.setItem(TOKEN_KEY,d.token);localStorage.setItem(USER_KEY,JSON.stringify(d.user));setUser(d.user);};
 const value:AuthContextValue={user,loading,
  login:async(email,password)=>{const {data}=await api.post('/auth/login',{email,password});save(data);},
  register:async(name,email,password)=>{const {data}=await api.post('/auth/register',{name,email,password});save(data);},
  logout:()=>{localStorage.removeItem(TOKEN_KEY);localStorage.removeItem(USER_KEY);setUser(null);}
 };
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(){const c=useContext(AuthContext);if(!c)throw new Error('useAuth must be inside AuthProvider');return c;}

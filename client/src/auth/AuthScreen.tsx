import { useState, type FormEvent } from 'react';
import { Wallet, Eye, EyeOff } from 'lucide-react';
import { useAuth } from './AuthContext';
export default function AuthScreen(){
 const {login,register}=useAuth();const [mode,setMode]=useState<'login'|'register'>('login');
 const [name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState('');
 const [show,setShow]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function submit(e:FormEvent){e.preventDefault();setError('');setBusy(true);try{if(mode==='login')await login(email,password);else await register(name,email,password);}catch(err:unknown){const message=(err as {response?:{data?:{error?:string}}})?.response?.data?.error;setError(message??'Something went wrong. Please try again.');}finally{setBusy(false);}}
 return <main className="min-h-screen bg-bg flex items-center justify-center px-4 py-10 text-text-primary"><section className="w-full max-w-md rounded-2xl border border-border bg-surface p-7 shadow-xl">
 <div className="mb-7 flex items-center gap-3"><div className="rounded-xl bg-accent p-3 text-white"><Wallet size={24}/></div><div><h1 className="text-2xl font-bold">Ledgr</h1><p className="text-sm text-text-muted">Personal budget tracker</p></div></div>
 <h2 className="text-xl font-semibold">{mode==='login'?'Welcome back':'Create your account'}</h2><p className="mt-1 text-sm text-text-muted">{mode==='login'?'Sign in to manage your finances.':'Register to start tracking your finances.'}</p>
 <form onSubmit={submit} className="mt-6 space-y-4">
 {mode==='register'&&<label className="block text-sm">Full name<input required minLength={2} maxLength={100} value={name} onChange={e=>setName(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-3"/></label>}
 <label className="block text-sm">Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-3"/></label>
 <label className="block text-sm">Password<div className="relative mt-1"><input required minLength={mode==='register'?8:1} maxLength={72} type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-lg border border-border bg-bg px-3 py-3 pr-12"/><button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-3 text-text-muted" aria-label="Toggle password">{show?<EyeOff size={19}/>:<Eye size={19}/>}</button></div>{mode==='register'&&<span className="mt-1 block text-xs text-text-muted">Use at least 8 characters.</span>}</label>
 {error&&<p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>}
 <button disabled={busy} className="w-full rounded-lg bg-accent px-4 py-3 font-semibold text-white disabled:opacity-60">{busy?'Please wait…':mode==='login'?'Sign in':'Create account'}</button></form>
 <p className="mt-6 text-center text-sm text-text-muted">{mode==='login'?"Don't have an account?":'Already registered?'} <button className="font-semibold text-accent" onClick={()=>{setMode(mode==='login'?'register':'login');setError('');}}>{mode==='login'?'Create one':'Sign in'}</button></p>
 </section></main>;
}

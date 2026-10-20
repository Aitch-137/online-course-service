import {createContext,useCallback,useEffect,useState} from "react";
export const UserContext=createContext(null);
export const API_URL=(import.meta.env.VITE_API_URL||"http://localhost:3000").replace(/\/$/,"");
export async function api(path,options={}){
 const res=await fetch(`${API_URL}${path}`,{...options,credentials:"include",headers:{"Content-Type":"application/json",...options.headers}});
 const body=await res.json().catch(()=>({}));
 if(!res.ok)throw new Error(body.message||`Request failed (${res.status})`);
 return body;
}
export function UserProvider({children}){
 const [user,setUser]=useState(null),[loading,setLoading]=useState(true);
 const refresh=useCallback(async()=>{try{setUser((await api("/api/auth/me")).user)}catch{setUser(null)}finally{setLoading(false)}},[]);
 useEffect(()=>{refresh()},[refresh]);
 const login=async(login,password)=>{const result=await api("/api/auth/login",{method:"POST",body:JSON.stringify({login,password})});setUser(result.user);return result.user};
 const logout=async()=>{await api("/api/auth/logout",{method:"POST"});setUser(null)};
 return <UserContext.Provider value={{user,loading,login,logout,refresh}}>{children}</UserContext.Provider>;
}

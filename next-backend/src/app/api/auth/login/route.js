import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../../../../lib/db";
import { json,fail,options,publicUser } from "../../../../lib/api";
export const OPTIONS=options;
export async function POST(req){
 try {
  const {login,password}=await req.json();
  if(typeof login!=="string" || typeof password!=="string")return fail(req,"Login and password required",400);
  const key=login.trim().toLowerCase();
  const u=await (await db()).collection("users").findOne({$or:[{username:key},{email:key}]});
  if(!u || !await bcrypt.compare(password,u.passwordHash))return fail(req,"Invalid credentials",401);
  const token=jwt.sign({id:String(u._id)},process.env.JWT_SECRET,{expiresIn:"12h",algorithm:"HS256"});
  const response=json(req,{user:publicUser(u)});
  response.cookies.set("token",token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:process.env.NODE_ENV==="production"?"none":"lax",path:"/",maxAge:43200});
  return response;
 } catch(e){console.error(e);return fail(req,"Login failed",500);}
}

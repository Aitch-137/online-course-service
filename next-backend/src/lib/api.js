import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { db } from "./db";
import { corsFor } from "./cors";
export const json=(req,data,status=200)=>NextResponse.json(data,{status,headers:corsFor(req)});
export const fail=(req,message,status=400)=>json(req,{message},status);
export const options=req=>new Response(null,{status:204,headers:corsFor(req)});
export const oid=id=>ObjectId.isValid(id)&&String(new ObjectId(id))===id ? new ObjectId(id) : null;
export async function currentUser(req) {
 try {
  const token=req.cookies.get("token")?.value;
  if(!token || !process.env.JWT_SECRET) return null;
  const data=jwt.verify(token,process.env.JWT_SECRET,{algorithms:["HS256"]});
  const _id=oid(data.id);if(!_id)return null;
  const u=await (await db()).collection("users").findOne({_id});
  return u ? {_id:u._id, username:u.username,email:u.email,role:u.role} : null;
 } catch { return null; }
}
export function publicUser(u){return {id:String(u._id),username:u.username,email:u.email,role:u.role};}
export function publicCourse(c, extra={}){return {id:String(c._id),name:c.name,durationDays:c.durationDays,topics:c.topics,price:c.price,maxStudent:c.maxStudent,status:c.status,teacherId:String(c.teacherId),teacherName:c.teacherName,enrolledCount:c.enrolledCount||0,...extra};}
export function validateCourse(data){
 const name=String(data.name||'').trim();const topics=Array.isArray(data.topics)?data.topics.map(x=>String(x).trim()).filter(Boolean):[];
 const durationDays=Number(data.durationDays),price=Number(data.price),maxStudent=Number(data.maxStudent);
 const status=data.status;
 if(!name || name.length>120 || !topics.length || topics.length>30 || topics.some(t=>t.length>100) || !Number.isInteger(durationDays)||durationDays<1||durationDays>3650 || !Number.isFinite(price)||price<0 || !Number.isSafeInteger(maxStudent)||maxStudent<1||maxStudent>100000 || !["Open","Close","Cancel"].includes(status)) return null;
 return {name,topics,durationDays,price,maxStudent,status};
}

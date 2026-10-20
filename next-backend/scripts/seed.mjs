import {MongoClient} from "mongodb";
import bcrypt from "bcrypt";
import fs from "node:fs";
import path from "node:path";
// Reads the local .env.local file without extra dependencies.
const envPath=path.resolve(".env.local");
if(fs.existsSync(envPath))for(const line of fs.readFileSync(envPath,"utf8").split(/\r?\n/)){const i=line.indexOf("=");if(i>0&&!line.trim().startsWith("#"))process.env[line.slice(0,i).trim()] ||= line.slice(i+1).trim().replace(/^['"]|['"]$/g,"");}
const uri=process.env.MONGODB_URI;if(!uri)throw new Error("Set MONGODB_URI in .env.local");
const client=new MongoClient(uri);await client.connect();
try{
 const d=client.db(process.env.MONGODB_DB||"online_courses");
 await d.collection("users").createIndex({username:1},{unique:true});await d.collection("users").createIndex({email:1},{unique:true});
 await d.collection("enrollments").createIndex({courseId:1,studentId:1},{unique:true});
 await d.collection("courses").createIndex({teacherId:1});
 const password=process.env.SEED_PASSWORD || "DemoPass123!";
 for(const role of ["Teacher","Student"])for(let i=1;i<=3;i++){
  const username=`${role.toLowerCase()}${i}`;
  await d.collection("users").updateOne({username},{$setOnInsert:{username,email:`${username}@example.com`,passwordHash:await bcrypt.hash(password,12),role,createdAt:new Date()}},{upsert:true});
 }
 const teacher=await d.collection("users").findOne({username:"teacher1"});
 if(!await d.collection("courses").countDocuments({teacherId:teacher._id})){
  await d.collection("courses").insertMany([
   {name:"Introduction to React",durationDays:20,topics:["JSX","Components","Hooks"],price:99,maxStudent:10,status:"Open",teacherId:teacher._id,teacherName:teacher.username,enrolledCount:0,createdAt:new Date()},
   {name:"MongoDB Essentials",durationDays:14,topics:["Collections","Queries"],price:79,maxStudent:5,status:"Close",teacherId:teacher._id,teacherName:teacher.username,enrolledCount:0,createdAt:new Date()},
   {name:"Legacy Web Design",durationDays:10,topics:["HTML"],price:49,maxStudent:5,status:"Cancel",teacherId:teacher._id,teacherName:teacher.username,enrolledCount:0,createdAt:new Date()}
  ]);
 }
 console.log("Seed complete: teacher1..3 and student1..3; password:",password);
}finally{await client.close();}

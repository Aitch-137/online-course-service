import {db} from "../../../lib/db";
import {currentUser,fail,json,options,publicCourse,validateCourse} from "../../../lib/api";
export const OPTIONS=options;
export async function GET(req){
 const user=await currentUser(req);if(!user)return fail(req,"Unauthorized",401);
 const database=await db(),courses=database.collection("courses");let filter={};
 if(user.role==="Teacher")filter={teacherId:user._id};
 else if(user.role==="Student")filter={status:{$ne:"Cancel"}};
 else return fail(req,"Forbidden",403);
 const q=(new URL(req.url)).searchParams.get("q")?.trim().slice(0,100).toLowerCase();
 const rows=await courses.find(filter).sort({createdAt:-1}).toArray();
 const filtered=q?rows.filter(c=>c.name.toLowerCase().includes(q)||(c.teacherName||"").toLowerCase().includes(q)):rows;
 return json(req,{courses:filtered.map(c=>publicCourse(c))});
}
export async function POST(req){
 const u=await currentUser(req);if(!u)return fail(req,"Unauthorized",401);
 if(u.role!=="Teacher")return fail(req,"Teachers only",403);
 let data;try{data=validateCourse(await req.json());}catch{return fail(req,"Invalid JSON",400);}
 if(!data)return fail(req,"Invalid course fields",400);
 const row={...data,teacherId:u._id,teacherName:u.username,enrolledCount:0,createdAt:new Date()};
 const result=await (await db()).collection("courses").insertOne(row);
 return json(req,{course:publicCourse({...row,_id:result.insertedId})},201);
}

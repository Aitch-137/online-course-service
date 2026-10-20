import {db} from "../../../../lib/db";
import {currentUser,fail,json,options,oid,publicCourse,validateCourse} from "../../../../lib/api";
export const OPTIONS=options;
async function load(req,params){const u=await currentUser(req);if(!u)return {error:fail(req,"Unauthorized",401)};
 const {course_id}=await params;const id=oid(course_id);if(!id)return {error:fail(req,"Invalid course ID",400)};
 const database=await db();const c=await database.collection("courses").findOne({_id:id});if(!c)return {error:fail(req,"Course not found",404)};
 if(u.role==="Teacher"&&String(c.teacherId)!==String(u._id))return {error:fail(req,"Forbidden",403)};
 if(u.role==="Student"&&c.status==="Cancel")return {error:fail(req,"Course unavailable",404)};
 return {u,c,database,id};}
export async function GET(req,{params}){const x=await load(req,params);if(x.error)return x.error;
 let extras={};if(x.u.role==="Teacher"){
 const enrollments=await x.database.collection("enrollments").find({courseId:x.id}).toArray();
 const ids=enrollments.map(e=>e.studentId);const users=ids.length?await x.database.collection("users").find({_id:{$in:ids}}).project({username:1,email:1}).toArray():[];
 extras.students=users.map(u=>({id:String(u._id),username:u.username,email:u.email}));
 }else{extras.isEnrolled=!!await x.database.collection("enrollments").findOne({courseId:x.id,studentId:x.u._id});}
 return json(req,{course:publicCourse(x.c,extras)});}
export async function PUT(req,{params}){const x=await load(req,params);if(x.error)return x.error;if(x.u.role!=="Teacher")return fail(req,"Forbidden",403);
 let data;try{data=validateCourse(await req.json())}catch{return fail(req,"Invalid JSON",400)}
 if(!data)return fail(req,"Invalid course fields",400);
 const result=await x.database.collection("courses").findOneAndUpdate({_id:x.id,teacherId:x.u._id,enrolledCount:{$lte:data.maxStudent}},{$set:data},{returnDocument:"after"});
 if(!result)return fail(req,"Cannot lower maximum below current enrollment",409);
 return json(req,{course:publicCourse(result)});}
export async function DELETE(req,{params}){const x=await load(req,params);if(x.error)return x.error;if(x.u.role!=="Teacher")return fail(req,"Forbidden",403);
 const deleted=await x.database.collection("courses").deleteOne({_id:x.id,teacherId:x.u._id,enrolledCount:0});
 return deleted.deletedCount?json(req,{message:"Course deleted"}):fail(req,"Cannot delete a course with enrolled students",409);}

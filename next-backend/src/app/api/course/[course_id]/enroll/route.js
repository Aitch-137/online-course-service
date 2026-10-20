import {MongoServerError} from "mongodb";
import {db} from "../../../../../lib/db";
import {currentUser,fail,json,options,oid} from "../../../../../lib/api";
export const OPTIONS=options;
export async function POST(req,{params}){
 const u=await currentUser(req);if(!u)return fail(req,"Unauthorized",401);
 if(u.role!=="Student")return fail(req,"Students only",403);
 const {course_id}=await params;const id=oid(course_id);if(!id)return fail(req,"Invalid course ID",400);
 const database=await db(),courses=database.collection("courses"),enrollments=database.collection("enrollments");
 // A transaction ensures capacity updates and the enrollment relationship commit together.
 const client=await (await import("../../../../../lib/mongodb")).getClientPromise();
 const session=client.startSession();
 try{
  let code=201,message="Enrolled successfully";
  await session.withTransaction(async()=>{
   const old=await enrollments.findOne({courseId:id,studentId:u._id},{session});
   if(old){code=409;message="Already enrolled";return;}
   const course=await courses.findOne({_id:id},{session});
   if(!course){code=404;message="Course not found";return;}
   if(course.status!=="Open"){code=409;message="Course is not open";return;}
   const updated=await courses.updateOne({_id:id,status:"Open",enrolledCount:{$lt:course.maxStudent}},{$inc:{enrolledCount:1}},{session});
   if(!updated.modifiedCount){code=409;message="No seats available";return;}
   await enrollments.insertOne({courseId:id,studentId:u._id,enrolledAt:new Date()},{session});
  });
  return code===201?json(req,{message},201):fail(req,message,code);
 }catch(e){
  if(e instanceof MongoServerError && e.code===11000)return fail(req,"Already enrolled",409);
  console.error(e);return fail(req,"Enrollment failed. MongoDB transactions require an Atlas replica set.",500);
 }finally{await session.endSession();}
}

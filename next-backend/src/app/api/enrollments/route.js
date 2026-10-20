import {db} from "../../../lib/db";
import {currentUser,fail,json,options,publicCourse} from "../../../lib/api";
export const OPTIONS=options;
export async function GET(req){const u=await currentUser(req);if(!u)return fail(req,"Unauthorized",401);if(u.role!=="Student")return fail(req,"Students only",403);
 const database=await db(),list=await database.collection("enrollments").find({studentId:u._id}).toArray();
 const rows=list.length?await database.collection("courses").find({_id:{$in:list.map(e=>e.courseId)}}).toArray():[];
 return json(req,{courses:rows.map(r=>publicCourse(r))});}

import { getClientPromise } from "./mongodb";
export async function db() { return (await getClientPromise()).db(process.env.MONGODB_DB || "online_courses"); }
export async function setupIndexes(database) {
 await Promise.all([
  database.collection("users").createIndex({username:1},{unique:true}),
  database.collection("users").createIndex({email:1},{unique:true}),
  database.collection("enrollments").createIndex({courseId:1,studentId:1},{unique:true}),
  database.collection("courses").createIndex({teacherId:1}),
 ]);
}

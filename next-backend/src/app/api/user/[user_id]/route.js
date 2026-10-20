import {currentUser,fail,json,options,oid,publicUser} from "../../../../lib/api";
import {db} from "../../../../lib/db";
export const OPTIONS=options;
export async function GET(req,{params}){
 const u=await currentUser(req);if(!u)return fail(req,"Unauthorized",401);
 const {user_id}=await params;const id=oid(user_id);if(!id)return fail(req,"Invalid user ID",400);
 if(String(u._id)!==user_id)return fail(req,"Forbidden",403);
 const record=await (await db()).collection("users").findOne({_id:id});return record?json(req,{user:publicUser(record)}):fail(req,"Not found",404);
}

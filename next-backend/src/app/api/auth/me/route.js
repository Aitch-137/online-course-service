import {currentUser,fail,json,options,publicUser} from "../../../../lib/api";
export const OPTIONS=options;
export async function GET(req){const u=await currentUser(req);return u?json(req,{user:publicUser(u)}):fail(req,"Unauthorized",401);}

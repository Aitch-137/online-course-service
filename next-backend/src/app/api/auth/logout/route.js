import {json,options} from "../../../../lib/api";
export const OPTIONS=options;
export async function POST(req){const r=json(req,{message:"Logged out"});r.cookies.set("token","",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:process.env.NODE_ENV==="production"?"none":"lax",path:"/",maxAge:0});return r;}

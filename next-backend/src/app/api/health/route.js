import {json,options} from "../../../lib/api";
export const OPTIONS=options;
export async function GET(req){return json(req,{status:"ok"});}

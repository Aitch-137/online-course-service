import {NextResponse} from "next/server";
import {corsFor} from "./lib/cors";
export function proxy(request){
 if(request.method==="OPTIONS" && request.nextUrl.pathname.startsWith("/api/"))return new Response(null,{status:204,headers:corsFor(request)});
 return NextResponse.next();
}
export const config={matcher:["/api/:path*"]};

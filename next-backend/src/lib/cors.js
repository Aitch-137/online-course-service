const allowed = (process.env.FRONTEND_URL || "http://localhost:5173").split(",").map(s=>s.trim());
export function corsFor(request) {
 const origin = request.headers.get("origin");
 const headers = {"Access-Control-Allow-Methods":"GET,POST,PUT,PATCH,DELETE,OPTIONS", "Access-Control-Allow-Headers":"Content-Type", "Access-Control-Allow-Credentials":"true", "Vary":"Origin"};
 if(origin && allowed.includes(origin)) headers["Access-Control-Allow-Origin"] = origin;
 return headers;
}
export default {};

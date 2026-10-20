import {MongoClient} from "mongodb";
const uri=process.env.MONGODB_URI;
let promise;
export function getClientPromise(){
 if(!uri)throw new Error("MONGODB_URI is required");
 if(!promise)promise=new MongoClient(uri).connect();
 return promise;
}

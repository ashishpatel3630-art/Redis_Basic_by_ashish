import { Worker } from "bullmq";
import {connection} from "./queue";

const worker = new Worker(
    'emails', 
    console.log("server is running on port http://localhost:3000")
    
)
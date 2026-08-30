import express from "express"
import { body } from "framer-motion/client";
import Redis from "ioredis"

const app = express();
app.use(express.json())

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379" );

const QUEUE_KEY = 'queue:emails';

app.post("/emails" , async( req , res)=>{
    const job ={
        to : req.body.to,
        subject : req.body.subject || "No Subject",
        body: req.body.body || "No content ", 
        createdAt: new Date().toDateString()
    }
    await redis.lpush(QUEUE_KEY, JSON.stringify(job));
    
})
import express from "express";
import { title } from "framer-motion/client";
import { create } from "framer-motion/m";
import Redis from "ioredis";

const app = express();
app.use(express.json());


const publisher = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.post("/notification" , async(req , res)=>{
    const payload = {
        title : req.body.title || "Default Title",
        createdAt : new Date().toISOString(),


    }
    const receivers  = await publisher.publish("notification",JSON.stringify(payload));
    res.json({
        message : `notification sent to ${receivers} subscribers`
    });
});

app.listen(3000, ()=>{
    console.log("Server is Running on port http://localhost:3000")
});
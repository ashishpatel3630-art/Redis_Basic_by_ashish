import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());


const publisher = new Redis(process.env.REDIS_URL || "redis://localhost:6379");


app.listen(3000, ()=>{
    
})
import { Job, Worker } from "bullmq";
import { connection } from "./queue";

const worker = new Worker("emails", async (Job) => {
  (console.log("processing email.job ... ", Job.id, Job.name, Job.data),
    await new Promise((resolve) => setTimeout(resolve, 1500)),
    console.log("Email Job Completed !", Job.id, Job.name, Job.data));
},
{connection}
);

worker.on("completed", (Job) =>{
    console.log("job completed!" ,Job.id ,Job.name, Job.data);

});

worker.on("failed", (Job , err)=>{
    console.log("job failed! " , Job.id , Job.name , Job.data ,err);
}
);

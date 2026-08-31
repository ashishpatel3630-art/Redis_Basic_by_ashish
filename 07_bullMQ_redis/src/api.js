import express from "express";
import { emailQueue } from "./queue.js";

const app = express();

app.use(express.json());

app.post("/welcome-email", async (req, res) => {
  try {
    const job = await emailQueue.add(
      "send-welcome-email",
      {
        to: req.body.to,
        name: req.body.name || "learner",
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      }
    );

    res.json({
      message: "Welcome email job added to the queue",
      jobId: job.id,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add job to queue",
      error: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
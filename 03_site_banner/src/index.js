import express from "express";
import Redis from "ioredis";

const app = express();

app.use(express.json());

const redis = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

const BANNER_KEY = "app:banner";


app.post("/banner", async (req, res) => {
  try {
    const message = req.body.message || "Welcome to Chai aur Redis";

    await redis.set(BANNER_KEY, message);

    res.json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


app.get("/banner", async (req, res) => {
  try {
    const message = await redis.get(BANNER_KEY);

    res.json({
      message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


app.delete("/banner", async (req, res) => {
  try {
    await redis.del(BANNER_KEY);

    res.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/banner/exists", async (req, res) => {
  try {
    const exists = await redis.exists(BANNER_KEY);

    res.json({
      exists: Boolean(exists),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
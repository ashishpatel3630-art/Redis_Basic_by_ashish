import express from "express";
import Redis from "ioredis";

const app = express();

app.use(express.json());

const redis = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

function otpKey(phone) {
  return `otp:${phone}`;
}


app.post("/otp", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await redis.set(
      otpKey(phone),
      otp,
      "EX",
      300
    );

    res.json({
      message: "OTP sent",
      otp, // Remove this in production
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});


app.post("/otp/verify", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        message: "Phone and OTP are required",
      });
    }

    const savedOtp = await redis.get(
      otpKey(phone)
    );

    if (!savedOtp) {
      return res.status(400).json({
        message: "OTP expired or not found",
      });
    }

    if (savedOtp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    await redis.del(otpKey(phone));

    res.json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});


app.get("/otp/:phone/ttl", async (req, res) => {
  try {
    const ttl = await redis.ttl(
      otpKey(req.params.phone)
    );

    res.json({
      ttl,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log(
    "Server running on http://localhost:3000"
  );
});
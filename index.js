import cors from "cors";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import connectDB from "./db/index.js";

// routers
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middlewares/error.middleware.js";
import uploadsRouter from "./routes/uploads.routes.js";
import userRouter from "./routes/user.routes.js";
import verificationRouter from "./routes/verification.routes.js";
import sessionRouter from "./routes/session.routes.js";
import jobRouter from "./routes/job.routes.js";


const app = express();

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 5 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

app.use(limiter);
app.use(cors());
app.use(helmet());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.get("/", (req, res) => {
  return res.send("API is working....");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/verification", verificationRouter);
app.use("/api/v1/session", sessionRouter);
app.use("/api/v1/job", jobRouter);

app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server is listening on port ${process.env.PORT}...`);
  });
};

startServer();

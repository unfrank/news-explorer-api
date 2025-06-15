import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import auth from "./middlewares/auth.js";
import limiter from "./middlewares/rate-limiter.js";
import { requestLogger, errorLogger } from "./middlewares/logger.js";
import errorHandler from "./middlewares/error-handler.js";
import articlesRouter from "./routes/articles.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const { PORT = 3000, MONGO_URI = "mongodb://127.0.0.1:27017/newsdb" } =
  process.env;
const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(limiter);
app.use(requestLogger);
app.use(errorLogger);
app.use(errorHandler);
app.use("/articles", auth, articlesRouter);

app.get("/", (req, res) => {
  res.send({ message: "News Explorer API is running!" });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

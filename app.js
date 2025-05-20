import cors from "cors";

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import articlesRouter from "./routes/articles.js";

import authRoutes from "./routes/auth.js";

dotenv.config();

const { PORT = 3000, MONGO_URI = "mongodb://127.0.0.1:27017/newsdb" } =
  process.env;

const app = express();

// ✅ Good order: enable CORS *before* any routes
app.use(cors());
app.use(express.json());

// ✅ Mount auth routes before protected ones
app.use(authRoutes);

// ✅ Then mount article routes
app.use("/articles", articlesRouter);

// Root route
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

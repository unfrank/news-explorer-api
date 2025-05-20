import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import articlesRouter from "./routes/articles.js";

dotenv.config();

const { PORT = 3000, MONGO_URI = "mongodb://127.0.0.1:27017/newsdb" } =
  process.env;

const app = express();

app.use(express.json());

app.use("/articles", articlesRouter);

// Sample root route
app.get("/", (req, res) => {
  res.send({ message: "News Explorer API is running!" });
});

// TODO: do routes here
app.use("/articles", articlesRouter);

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

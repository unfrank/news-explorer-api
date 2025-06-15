import express from "express";
import {
  getArticles,
  saveArticle,
  deleteArticle,
} from "../controllers/articles.js";

const router = express.Router();

router.get("/", getArticles);
router.post("/", saveArticle);
router.delete("/:id", deleteArticle);

export default router;

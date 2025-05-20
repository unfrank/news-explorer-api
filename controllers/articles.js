import Article from "../models/article.js";
import mongoose from "mongoose";

const DUMMY_USER_ID = new mongoose.Types.ObjectId("000000000000000000000001"); // replace later with real user ID

export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({ owner: DUMMY_USER_ID });
    res.status(200).send(articles);
  } catch (err) {
    res
      .status(500)
      .send({ error: "Failed to fetch articles", details: err.message });
  }
};

export const saveArticle = async (req, res) => {
  try {
    const article = await Article.create({
      ...req.body,
      owner: DUMMY_USER_ID,
    });
    res.status(201).send(article);
  } catch (err) {
    res
      .status(400)
      .send({ error: "Failed to save article", details: err.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findOneAndDelete({
      _id: req.params.id,
      owner: DUMMY_USER_ID,
    });

    if (!article) {
      return res
        .status(404)
        .send({ error: "Article not found or not owned by user" });
    }

    res.send({ message: "Article deleted" });
  } catch (err) {
    res
      .status(400)
      .send({ error: "Failed to delete article", details: err.message });
  }
};

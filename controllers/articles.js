import Article from "../models/article.js";
import mongoose from "mongoose";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../errors/index.js";

// const DUMMY_USER_ID = new mongoose.Types.ObjectId("000000000000000000000001"); // replace later with real user ID

export const getArticles = async (req, res) => {
  try {
    // const articles = await Article.find({ owner: DUMMY_USER_ID });
    const articles = await Article.find({ owner: req.user._id });
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
      owner: req.user._id,
    });
    res.status(201).send(article);
  } catch (err) {
    throw new BadRequestError(`Failed to save article: ${err.message}`);
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      throw new NotFoundError("Article not found");
    }

    if (!article.owner.equals(req.user._id)) {
      throw new ForbiddenError(
        "You do not have permission to delete this article"
      );
    }

    await article.deleteOne();

    res.send({ message: "Article deleted" });
  } catch (err) {
    throw new BadRequestError(`Failed to delete article: ${err.message}`);
  }
};

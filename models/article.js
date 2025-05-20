import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  urlToImage: String,
  publishedAt: Date,
  source: {
    id: String,
    name: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Article", articleSchema);

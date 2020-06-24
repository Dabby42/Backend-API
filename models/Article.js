import mongoose from "mongoose";

let ArticleSchema = mongoose.Schema({
  title: {type: String, required: true},
  backgroundImage: {type: String},
  image: {type: String},
  content: {type: String, required: true},
  source: {type: String},
  sourceImage: {type: String},
  published: {type: Boolean, default: false},
  publishedAt: { type: Date},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;

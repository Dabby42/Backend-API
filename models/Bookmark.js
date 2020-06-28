import mongoose from "mongoose";

let BookmarkSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    article: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

let Bookmark = mongoose.model("Bookmark", BookmarkSchema);

module.exports = Bookmark;
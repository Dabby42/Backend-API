import mongoose from "mongoose";

let BookmarkSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    article: {type: String},
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

let Interest = mongoose.model("Bookmark", BookmarkSchema);

module.exports = Interest;
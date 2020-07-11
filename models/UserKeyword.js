import mongoose from "mongoose";

let UserKeywordSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    keyword: {type: String},
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

let Keyword = mongoose.model("Keyword", UserKeywordSchema);

module.exports = Keyword;
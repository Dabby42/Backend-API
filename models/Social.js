import mongoose from "mongoose";

let SocialSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    provider: {type: String, required: true},
    longLivedAccessToken: {type: String, required: true},
    longLivedAccessTokenSecret: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    socialId: {type: String, required: true},
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

let Social = mongoose.model("Social", SocialSchema);

module.exports = Social;
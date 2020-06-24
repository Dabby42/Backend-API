import mongoose from "mongoose";

let UserInterestSchema = mongoose.Schema({
    interest: {type: String},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

let UserInterest = mongoose.model("UserInterest", UserInterestSchema);

module.exports = UserInterest;
import mongoose from "mongoose";

let UserInterestSchema = mongoose.Schema({
    interest: { type: mongoose.Schema.Types.ObjectId, ref: "Interest" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

let UserInterest = mongoose.model("UserInterest", UserInterestSchema);

module.exports = UserInterest;
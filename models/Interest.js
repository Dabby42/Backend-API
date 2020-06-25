import mongoose from "mongoose";

let InterestSchema = mongoose.Schema({
    image: {type: String},
    type: {type: String},
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

let Interest = mongoose.model("Interest", InterestSchema);

module.exports = Interest;
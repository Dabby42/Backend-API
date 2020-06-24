import mongoose from "mongoose";

let InterestSchema = mongoose.Schema({
    image: {type: String},
    name: {type: String},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

let Interest = mongoose.model("Interest", InterestSchema);

module.exports = Interest;
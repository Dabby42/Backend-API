import mongoose from "mongoose";

let SubscriptionSchema = mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  keywords: {type: Number},
  mentions: {type: Number},
  socialAccounts: {type: Number},
  shares: {type: Number},
  duration: {type: Number, required: true},
  amount: {type: Number, required: true},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

let Subscription = mongoose.model("Subscription", SubscriptionSchema);

module.exports = Subscription;

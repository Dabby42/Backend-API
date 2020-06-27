import mongoose from "mongoose";

let UserSubscriptionSchema = mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

let UserSubscription = mongoose.model("UserSubscription", UserSubscriptionSchema);

module.exports = UserSubscription;

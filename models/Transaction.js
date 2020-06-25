import mongoose from "mongoose";

let TransactionSchema = mongoose.Schema({
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {type: String, default: 'initiated'},
  trials: {type: Number, default: 0},
  amount: {type: Number},
  reference: {type: String, required: true, unique: true, index: true},
  channel: {type: String, default: 'paystack'},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

let Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;

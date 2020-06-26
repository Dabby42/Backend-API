import mongoose from "mongoose";

let NotificationSchema = mongoose.Schema({
    title: {type: String},
    content: {type: String},
    isActive: { type: Boolean, default: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

let Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
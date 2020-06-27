import mongoose from "mongoose";

let SettingsSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    twitter: {
        isActive: {type: Boolean, default: false}
    },
    facebook: {
        isActive: {type: Boolean, default: false}
    },
    instagram: {
        isActive: {type: Boolean, default: false}
    },
    pushNotification: {type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

let Settings = mongoose.model("Settings", SettingsSchema);

module.exports = Settings;
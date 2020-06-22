import mongoose from "mongoose";
import bcrypt from 'bcrypt';
const hasRolesAndClaims = require('gatemanjs').hasRolesAndClaims(mongoose);

let UserSchema = mongoose.Schema({
  firstName: {type: String},
  lastName: {type: String},
  email: {type: String,unique: true, index: true},
  password: {type: String},
  avatar: {type: String},
  provider: {type: String, required: true},
  socialId: {type: String},
  provider: {type: String, required: true},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  userSubscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
});

UserSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.toJSON = function() {
  var user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  delete user.__v;
  return user;
 }

UserSchema.loadClass(hasRolesAndClaims);
let User = mongoose.model("User", UserSchema);

module.exports = User;

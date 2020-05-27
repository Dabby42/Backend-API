const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

let UserSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  profile: { type: mongoose.Schema.Types.ObjectId, ref: "UserProfile" },
  dateOfCreation: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

userSchema.pre('save', function(next) {
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

mongoose.model("User", UserSchema);

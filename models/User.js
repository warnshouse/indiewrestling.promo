const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  userImage: { type: String, required: false },
  cloudinaryId: { type: String, required: false },
  followedUsers: [{ type: ObjectId, ref: "User" }],
  followedPromos: [{ type: ObjectId, ref: "Promotion" }],
  isFan: { type: Boolean, default: true },
  isWrestler: { type: Boolean, required: false },
  isOwner: { type: Boolean, required: false },
  isAdmin: { type: Boolean, required: false },
  ownerName: { type: Boolean, required: false},
  ringName: { type: String, required: false},
  wrestlerImage: { type: String, required: false },
  wCloudinaryId: { type: String, required: false },
  height: { type: String, required: false},
  weight: { type: String, required: false},
  biography: { type: String, required: false },
  teammates: [{ type: ObjectId, ref: "User" }],
  teams: { type: String, required: false },
  promos: [{ type: ObjectId, ref: "Promotion" }],
  joinDate: { type: Date, default: Date.now }
});

// Password hash middleware
UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
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

// Helper method for validating user's password
UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  user_id: {
    type: String,
  },
  email: {
    type: String,
    require: [true, "Email must be provided."],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email.",
    ],
    minlength: [6, "Plesse provide valid email(short)."],
    unique: [true, "There is already an account registred to this email."],
  },
  password: {
    type: String,
    require: [true, "Password must be provided."],
    minlength: [3, "Password too short. (Minimum length: 3)."],
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  dd: {
    type: Number,
    minlength: [1, "Please enter a valid date of birth"],
    maxlength: [2, "Please enter a valid date of birth"],
  },
  mm: {
    type: Number,
    minlength: [1, "Please enter a valid date of birth"],
    maxlength: [2, "Please enter a valid date of birth"],
  },
  yy: {
    type: Number,
    minlength: [4, "Please enter a valid date of birth"],
    maxlength: [4, "Please enter a valid date of birth"],
  },
  sex: {
    type: String,
  },
  workingStatus: {
    type: String,
  },
});

// middleware
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// methods
userSchema.methods.getJWToken = function () {
  return jwt.sign(
    { id: this.user_id, email: this.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};
userSchema.methods.comparePasswords = async function (potentialPassword) {
  const isMatch = await bcrypt.compare(potentialPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);

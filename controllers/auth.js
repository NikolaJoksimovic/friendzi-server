const User = require("../models/user");
const { AuthenticationError } = require("../errors");
const { v4: uuidv4 } = require("uuid");

const registerUser = async (req, res) => {
  const { email, password, confirmPassword } = { ...req.body };
  if (password !== confirmPassword) {
    throw new AuthenticationError("Passwords do not match.");
  }
  const user = await User.create({
    user_id: uuidv4(),
    email: email,
    password: password,
  });
  res.send("register");
};
const loginUser = async (req, res) => {
  res.send("login");
};

module.exports = { registerUser, loginUser };

const User = require("../models/user");
const { AuthenticationError } = require("../errors");
const { v4: uuidv4 } = require("uuid");
const { StatusCodes } = require("http-status-codes");

const registerUser = async (req, res) => {
  const { email, password, confirmPassword } = { ...req.body };
  if (password !== confirmPassword) {
    throw new AuthenticationError("Passwords do not match.");
  }
  const userId = uuidv4();
  const user = await User.create({
    user_id: userId,
    email: email,
    password: password,
  });
  const token = user.getJWToken();
  res.status(StatusCodes.CREATED).json({ user: { id: userId, token: token } });
};
const loginUser = async (req, res) => {
  const { email, password } = { ...req.body };
  const user = await User.findOne({
    email: email,
  });
  const token = user.getJWToken();
  res.status(StatusCodes.OK).json({ user: { id: user.user_id, token: token } });
};

module.exports = { registerUser, loginUser };

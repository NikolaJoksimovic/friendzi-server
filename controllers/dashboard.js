const User = require("../models/user");
const { AuthenticationError, BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const findUser = async (req, res) => {
  const { userId } = {
    ...req.body,
  };
  // console.log({ ...req.body });
  const user = await User.findOne({ user_id: userId });
  if (!user) {
    throw new AuthenticationError("Could find the user with current id");
  }
  console.log(user);
  res
    .status(StatusCodes.OK)
    .json({ firstName: user.firstName, lastName: user.lastName });
};

module.exports = findUser;

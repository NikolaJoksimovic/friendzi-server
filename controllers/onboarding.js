const User = require("../models/user");
const { AuthenticationError, BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const updateUser = async (req, res) => {
  const { userId, firstName, lastName, dob, sex, workingStatus } = {
    ...req.body,
  };
  console.log({ ...req.body });
  const user = await User.findOneAndUpdate(
    { user_id: userId },
    {
      firstName: firstName,
      lastName: lastName,
      dob: dob,
      sex: sex,
      workingStatus: workingStatus,
    }
  );
  if (!user) {
    throw new AuthenticationError("Could find the user with current id");
  }

  res.status(StatusCodes.OK).json({ ...req.body });
};

module.exports = updateUser;

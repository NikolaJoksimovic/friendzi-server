require("dotenv").config;
const cloudinary = require("cloudinary").v2;

const User = require("../models/user");
const { AuthenticationError, CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

// update user
const updateUser = async (req, res) => {
  const { userId, firstName, lastName, dob, sex, workingStatus } = {
    ...req.body,
  };
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

// get user info
const getUserInfo = async (req, res) => {
  const user_id = req.body.userId;
  const user = await User.findOne({ user_id });
  if (!user) {
    throw new CustomAPIError("Server is busy right now.");
  }
  res.status(StatusCodes.OK).json(user);
};

// upload user image
cloudinary.config({
  cloud_name: process.env.CLDNRY_NAME,
  api_key: process.env.CLDNRY_API_KEY,
  api_secret: process.env.CLDNRY_API_SECRET,
});
const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

const uploadUserImg = async (req, res) => {
  const { user_id, image } = { ...req.body };
  // console.log({ ...req.body });

  const response = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts, (error, result) => {
      if (result && result.secure_url) {
        return resolve(result.secure_url);
      }
      return reject({ message: error.message });
    });
  })
    .then((url) => {
      return url;
    })
    .catch((err) => {
      return err;
    });

  if (response) {
    console.log("url is: " + response);
  }

  res.status(StatusCodes.OK).json(user_id);
};

module.exports = { updateUser, getUserInfo, uploadUserImg };

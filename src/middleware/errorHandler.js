const { StatusCodes } = require("http-status-codes");

const errorHandler = async (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong...",
  };

  if (err.code === 11000) {
    customError.statusCode = StatusCodes.CONFLICT;
    customError.msg = "Account with this email already exists.";
  }
  if (err.name === "ValidationError") {
    let errMsg = "";
    Object.entries(err.errors).forEach(([key, value]) => {
      errMsg += `${value.message}`;
    });
    customError.msg = errMsg;
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandler;

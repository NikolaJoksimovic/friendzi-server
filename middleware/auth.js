require("dotenv").config();
const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("../errors/index");

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new AuthenticationError("Token not Provided.");
  }
  // console.log(authHeader);
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.body.user_id = payload.id;
  } catch (error) {
    throw new AuthenticationError("Token not provided(Bad Token).");
  }
  next();
};

module.exports = authenticationMiddleware;

const mongoose = require("mongoose");
const connectDB = (uri) => {
  mongoose.connect(uri, {}); //options{}
};
module.exports = connectDB;

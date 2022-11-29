require("dotenv").config();
const express = require("express");
const connectDB = require("./db/connectDB");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// routes

// Cannot GET on refresh solution
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/build/index.html");
});

// middleware

// server
const port = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDB(process.env.JWT_URI);
    app.listen(port, () => {
      console.log("Server is up and running on port " + port + "...");
    });
  } catch (error) {}
};

start();

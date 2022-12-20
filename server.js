require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connectDB = require("./db/connectDB");
const cors = require("cors");

const app = express();
const homeRouter = require("./routes/home");
const authRouter = require("./routes/auth");
const onboardingRouter = require("./routes/onboarding");
const dashboardRouter = require("./routes/dashboard");
const notFoundMiddleware = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");
const authenticationMiddleware = require("./middleware/auth");

app.use(cors());
app.use(express.json());
// app.use(express.static("public/build"));

// routes
app.use("/", homeRouter);
app.use("/auth", authRouter);
app.use("/onboarding", onboardingRouter);
app.use("/dashboard", authenticationMiddleware, dashboardRouter);

// Cannot GET on refresh solution
// app.get("*", (req, res) => {
//   res.sendFile(__dirname + "/public/build/index.html");
// });

// middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

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

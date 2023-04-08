require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connectDB = require("../db/connectDB");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const socketConfig = require("../sockets/socket_config");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// my modules
const homeRouter = require("../routes/home");
const authRouter = require("../routes/auth");
const onboardingRouter = require("../routes/onboarding");
const dashboardRouter = require("../routes/dashboard");
const myeventsRouter = require("../routes/my_evetns");
const notFoundMiddleware = require("../middleware/notFound");
const errorHandlerMiddleware = require("../middleware/errorHandler");
const authenticationMiddleware = require("../middleware/auth");

app.use(cors());
// setting the file size kinda(research this more)
app.use(express.json({ limit: "10mb" }));
// app.use(express.static("public/build"));

// routes
app.use("/", homeRouter);
app.use("/auth", authRouter);
app.use("/onboarding", onboardingRouter);
app.use("/dashboard", authenticationMiddleware, dashboardRouter);
app.use("/dashboard/myevents", authenticationMiddleware, myeventsRouter);

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
    httpServer.listen(port, () => {
      console.log("Server is up and running on port " + port + "...");
    });
    // socket.io config
    socketConfig(io);
  } catch (error) {}
};

start();

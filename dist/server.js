"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const homeRouter = require("../routes/home");
const authRouter = require("../routes/auth");
const onboardingRouter = require("../routes/onboarding");
const dashboardRouter = require("../routes/dashboard");
const myeventsRouter = require("../routes/my_evetns");
const notFoundMiddleware = require("../middleware/notFound");
const errorHandlerMiddleware = require("../middleware/errorHandler");
const authenticationMiddleware = require("../middleware/auth");
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/", homeRouter);
app.use("/auth", authRouter);
app.use("/onboarding", onboardingRouter);
app.use("/dashboard", authenticationMiddleware, dashboardRouter);
app.use("/dashboard/myevents", authenticationMiddleware, myeventsRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 8000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectDB(process.env.JWT_URI);
        httpServer.listen(port, () => {
            console.log("Server is up and running on port " + port + "...");
        });
        socketConfig(io);
    }
    catch (error) { }
});
start();
//# sourceMappingURL=server.js.map
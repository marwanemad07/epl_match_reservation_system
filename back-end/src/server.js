const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const authRouter = require("./routes/auth.routes");
const adminRouter = require("./routes/admin.routes");
const managerRouter = require("./routes/manager.routes");
const fanRouter = require("./routes/fan.routes");
const publicRouter = require("./routes/public.routes");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const httpServer = http.createServer(app);
exports.io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

this.io.on("connection", (socket) => {
  console.log("a user connected" + socket.id);
});

app.use(cookieParser());

app.use(bodyParser.json());

// Add headers to every response to allow cross-origin requests
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/auth", authRouter);

app.use("/api/admin", adminRouter);

app.use("/api/manager", managerRouter);

app.use("/api/fan", fanRouter);

app.use("/api/public", publicRouter);

httpServer.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

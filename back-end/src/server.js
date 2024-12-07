const express = require("express");
require("dotenv").config();
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const authRouter = require("./routes/auth.routes");
const adminRouter = require("./routes/admin.routes");
const managerRouter = require("./routes/manager.routes");

const app = express();

app.use(cookieParser());

app.use(bodyParser.json());

// Add headers to every response to allow cross-origin requests
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});

app.use("/api/auth", authRouter);

app.use("/api/admin", adminRouter);

app.use("/api/manager", managerRouter);

app.use((req, res, next) => {
    res.status(404).json({ statusCode: 404, message: "Page not found" });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
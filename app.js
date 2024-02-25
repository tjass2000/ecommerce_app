const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

app.use(express.json());

const adminRouter = require("./routes/adminRoute");
const userAuthRouter = require("./routes/userAuthRoute");
const homeRouter = require("./routes/homeRoute");

// app.get("/login", function (req, res) {
//   res.send("Login route has been triggered");
// });

app.use(cookieParser());

//Home Route
app.use("/api/v1/", homeRouter);

//Admin Route
app.use("/api/v1/admin", adminRouter);

//Login & Signup Route
app.use("/api/v1/auth", userAuthRouter);

app.get("/api/v1/auth", function (req, res) {
  res.send("Authentication route has been triggered");
});

app.all("*", (req, res, next) => {
  // res.status(404).json(`Can't find route ${req.originalUrl}`);
  // next();
  // const err = new Error(`Can't find route ${req.originalUrl} on this server`);
  // err.status = "fail";
  // err.statusCode = 404;
  next(new AppError(`Can't find route ${req.originalUrl} on this server`, 404));
});

//Central middleware for handling all error
app.use(globalErrorHandler);

module.exports = app;

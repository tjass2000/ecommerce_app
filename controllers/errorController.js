const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
  res
    .status(err.statusCode)
    .json({ status: err.status, message: err.message, stack: err.stack });
};
const sendErrorProd = (err, res) => {
  if (isOperational) {
    res
      .status(err.statusCode)
      .json({ status: err.status, message: err.message });
  } else {
    //Log Error
    console.error("Error", err);
    //Send generic message
    res
      .status(500)
      .json({ status: "error", message: "Something went very wrong!!" });
  }
};

const handleJWTError = (err) =>
  new AppError("Invalid token, Please login again to access this route.", 401);

const handleTokenExpError = (err) =>
  new AppError("Token expired! Please login again to access the route.", 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "JsonWebTokenError") {
      error = handleJWTError(error);
    }
    if (error.name === "TokenExpiredError") {
      error = handleTokenExpError(error);
    }
    sendErrorProd(err, res);
  }
};

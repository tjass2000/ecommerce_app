const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const viewRouter = require("./routes/viewRoutes");

app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(process.cwd() + "/public"));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//Routes
const adminRouter = require("./routes/adminRoute");
const userAuthRouter = require("./routes/userAuthRoute");
const homeRouter = require("./routes/homeRoute");
const reviewRouter = require("./routes/reviewRoute");
const productRouter = require("./routes/productRoute");
const bookingRouter = require("./routes/bookingRoute");
const wishlistRouter = require("./routes/wishlistRoute");
const cartRouter = require("./routes/cartRoute");

// app.get("/login", function (req, res) {
//   res.send("Login route has been triggered");
// });

//GLOBAL MIDDLEWARES

//HELMET MIDDLEWARE
app.use(helmet());

//REQ LIMITER MIDDLEWARE
const limiter = rateLimit({
  max: 100,
  window: 60 * 60 * 1000,
  message: "Too many request from this IP! Please try again after one hour!",
});

//Middleware to limit the number of attempts within a given time frame for a user
app.use("/api", limiter);

//COOKIE PARSER MIDDLEWARE
app.use(cookieParser());

//BODY PARSER MIDDLEWARE
app.use(express.json({ limit: "10kb" }));

//SANITIZE DATA TO PREVENT NOSQL INJECTION ATTACKS
app.use(mongoSanitize());

//REMOVE HTTP PARAMETER POLLUTION ATTACKS
app.use(
  hpp({
    whitelist: ["category"],
  })
);

//MIDDLEWARE TO PROTECT AGAINST XSS ATTACKS(Hacker adding malicious js and html code in payload)
app.use(xss());

app.use("/", viewRouter);

//Home Route
app.use("/api/v1/", homeRouter);

//Admin Route
app.use("/api/v1/admin", adminRouter);

//Review Route
app.use("/api/v1/reviews", reviewRouter);

//Product Route
app.use("/api/v1/products", productRouter);

//Login & Signup Route
app.use("/api/v1/auth", userAuthRouter);

//Booking Route
app.use("/api/v1/bookings", bookingRouter);

//Wishlist Route
app.use("/api/v1/wishlist", wishlistRouter);

//Cart Route
app.use("/api/v1/cart", cartRouter);

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

//Key Features of App
// 1. Search for Products
// 2. Wishlist
// 3. Cart
// 4. Payment
// 5. Sending Mails

//Remaining
//1. Cart(Done)
//2. Wishlist(Done)
//3. Frontend
//4. Email

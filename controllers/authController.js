const { promisify } = require("util");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

dotenv.config({ path: "./config.env" });

const userAuthModel = require("../models/userAuthModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const sendMail = require("../utils/email");

const maxAge = 24 * 60 * 60;

//Function to create token
const createToken = (id) => {
  return jwt.sign({ user_id: id }, process.env.TOKEN_KEY, {
    expiresIn: maxAge,
  });
};

//Function to handle token creation and response for all methods
const createSendToken = (user, statusCode, res) => {
  const token = createToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  //In Postman the name of cookie act as its key
  res.cookie("jwt", token, cookieOptions);

  //Remove password from response
  user.password = undefined;

  res.status(statusCode).json({ status: "success", token, data: { user } });
};

//Control for signup
exports.signupUser = catchAsync(async (req, res) => {
  const payload = req.body;
  const user = await userAuthModel.create(payload);

  createSendToken(user, 201, res);
  // const token = createToken(payload._id);
  // result.token = token;

  // res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });

  // res.status(201).json({ status: "success", data: { user: user } });
});

//Control for login user
exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userAuthModel.findOne({ email }).select("+password");
  const checkPassword = await user.correctPassword(password, user.password);
  if (!user || !checkPassword) {
    return next(new AppError("Incorrect email or password!!", 401));
  }
  createSendToken(user, 200, res);
  // const token = createToken(user._id);
  // res.status(200).json({ status: "success", token,  });
});

//Control for logout user
exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json("Logged out!!");
  } catch (err) {
    res.status(400).json("failed", err);
  }
};

//Forgot Password Handler
exports.forgotPassword = catchAsync(async (req, res) => {
  //Get user based on email
  var user = await userAuthModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError("No user exist for the given email address!!", 404)
    );
  }
  //Generate the password reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //Send it to user via email
  const requestURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a reset request with your new password to: ${requestURL}.\n If you didn't forget your password, please ignore this email.`;

  try {
    await sendMail({
      email: user.email,
      subject: "Your password reset token(Valid for 10 minutes)",
      message,
    });

    res.status(200).json({ status: "success", data: "Token send to mail" });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email! Please try again later",
        500
      )
    );
  }
});

//Reset Password Handler
exports.resetPassword = catchAsync(async (req, res, next) => {
  //Get the user based on the reset token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await userAuthModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  //Check if the user exists and the token is not expired, Update the user with the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired.", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  //Update the changedPasswordAt property
  // user.passwordChangedAt = Date.now();

  //Login the user in and send the JWT token
  createSendToken(user, 200, res);
  // const token = createToken(user._id);
  // res.status(200).json({ status: "success", token });
});

//Protect routes
exports.protect = catchAsync(async (req, res, next) => {
  //Getting token and check if it is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError(
        "You are not logged in!! Please log in to access the route.",
        401
      )
    );
  }
  //veriftication of token
  const decoded = await promisify(jwt.verify)(token, process.env.TOKEN_KEY);
  console.log(decoded);

  //Checking if user still exists
  const currentUser = await userAuthModel.findById(decoded.user_id);
  if (!currentUser) {
    return next(
      new AppError("The user for this token does not exist anymore.", 401)
    );
  }
  //Check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User has changed the password! Please log in again.", 401)
    );
  }

  // Grant Access to protected route
  //**PRO TIP** If you want to send data between middlewares use req object
  req.user = currentUser;
  next();
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //Get user from collection
  const user = await userAuthModel.findById(req.user.id).select("+password");

  //Check if posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is incorrect.", 401));
  }

  //if so update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //Log user in, send the JWT token
  createSendToken(user, 200, res);
  // const token = createToken(user._id);
  // res.status(200).json({ status: "success", response: { token } });
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You don't have the required permissions to perform this action!!",
          403
        )
      );
    }
    next();
  };
};

//We are using save instead of findybyIdAndUpdate so that the validations are not turned off.(Functions defined inside models
// won't work).

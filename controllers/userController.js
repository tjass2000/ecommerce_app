const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config({ path: "./config.env" });

const userAuthModel = require("../models/userAuthModel");
const catchAsync = require("../utils/catchAsync");

const maxAge = 24 * 60 * 60;

//Function to create token
const createToken = (id) => {
  return jwt.sign({ user_id: id }, process.env.TOKEN_KEY, {
    expiresIn: maxAge,
  });
};

//Control for signup
exports.signupUser = async (req, res) => {
  try {
    const payload = req.body;
    const result = await userAuthModel.create(payload);

    const token = createToken(payload._id);
    // result.token = token;

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });

    res.status(201).json({ status: "success", data: { result: result._id } });
  } catch (err) {
    res.status(400).json({ status: "Invalid data format", data: { err } });
  }
};

//Control for login user
exports.loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await userAuthModel.findOne({ email }).select("+password");
  console.log(user);
  if (user && password === user.password) {
    const token = createToken(user._id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json(user);
  }
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

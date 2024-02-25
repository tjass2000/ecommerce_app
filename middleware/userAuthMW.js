const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  next();
};

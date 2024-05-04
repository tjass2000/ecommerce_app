const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

router.get(
  "/checkout/:productId",
  authController.protect,
  bookingController.getBookingSession
);

module.exports = router;

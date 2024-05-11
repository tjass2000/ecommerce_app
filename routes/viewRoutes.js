const express = require("express");
const router = express.Router();
const viewController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

//Base view route
router.get("/", viewController.getOverview);
router.get("/login", viewController.getLoginPage);
router.get("/signup", viewController.getSignUpPage);
router.get("/myAccount", authController.protect, viewController.getMyAccount);
router.get("/myWishlist", authController.protect, viewController.getMyWishlist);
router.get("/myCart", authController.protect, viewController.getMyCart);
router.post(
  "/submit-user-data",
  authController.protect,
  viewController.updateUserData
);

module.exports = router;

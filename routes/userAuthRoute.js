const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const tokenCheck = require("../middleware/userAuthMW");

//Signup Route
router.route("/signup").post(userController.signupUser);

//Login Route
router.route("/login").post(userController.loginUser);

//Logout Route
router.route("/logout").post(userController.logoutUser);

//Home Route
router.route("/home").get(tokenCheck.verifyToken, (req, res) => {
  res.status(200).json("Welcome Back!!");
});

//Cart Route
router
  .route("/cart/:id")
  .get(tokenCheck.verifyToken, productController.getProdFrCart)
  .post(tokenCheck.verifyToken, productController.addToCart)
  .delete(tokenCheck.verifyToken, productController.delFrCart);

//Wishlist Route
router
  .route("/wishlist")
  .get(tokenCheck.verifyToken, productController.getProdFrWishlist)
  .post(tokenCheck.verifyToken, productController.addToWishlist);

//Products Route
router
  .route("/products")
  .get(tokenCheck.verifyToken, productController.getAllProducts);

module.exports = router;

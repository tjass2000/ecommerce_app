const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const tokenCheck = require("../middleware/userAuthMW");
// const multer = require("multer");
// const upload = multer({ dest: "public" });

//Signup Route
router.route("/signup").post(authController.signupUser);

//Login Route
router.route("/login").post(authController.loginUser);

//Me Route
router
  .route("/me")
  .get(authController.protect, userController.getMe, userController.getUser);

//Logout Route
router.route("/logout").post(authController.logoutUser);

//Forgot Password Route
router.route("/forgotPassword").post(authController.forgotPassword);

//Reset Password Route
router.route("/resetPassword/:token").patch(authController.resetPassword);

//Update current password in case when user remembers the password
router
  .route("/updateMyPassword")
  .patch(authController.protect, authController.updatePassword);

//Update details for authenticated user
router
  .route("/updateMe")
  .patch(
    authController.protect,
    userController.uploadMyPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
  );

//Allow user to delete his account
router
  .route("/deleteMe")
  .delete(authController.protect, userController.deleteMe);

//Home Route
// router.route("/home").get(tokenCheck.verifyToken, (req, res) => {
//   res.status(200).json("Welcome Back!!");
// });

//Cart Route
// router
//   .route("/cart/:id")
//   .get(tokenCheck.verifyToken, productController.getProdFrCart)
//   .post(tokenCheck.verifyToken, productController.addToCart)
//   .delete(tokenCheck.verifyToken, productController.delFrCart);

//Wishlist Route
// router
//   .route("/wishlist")
//   .get(tokenCheck.verifyToken, productController.getProdFrWishlist)
//   .post(tokenCheck.verifyToken, productController.addToWishlist);

//Products Route
router
  .route("/products")
  .get(authController.protect, productController.getAllProducts);

// Require admin access for all routes below this point
router.use(authController.restrictTo("admin"));

// Define routes for user management
router.route("/").get(userController.getUsers).post(userController.createUser);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

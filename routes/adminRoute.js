const express = require("express");
const router = express.Router();
const userAuthController = require("../controllers/userAuthController");
const productController = require("../controllers/productController");

//Admin Route for getting all users
router
  .route("/userDetails")
  .get(userAuthController.getUsers)
  .post(userAuthController.createUser);

//Admin Route to get specific user based on id
router
  .route("/userDetails/:id")
  .get(userAuthController.getUser)
  .delete(userAuthController.deleteUser)
  .put(userAuthController.updateUser);

//Admin Route to get all products
router
  .route("/productDetails")
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router
  .route("/productDetails/:id")
  .get(productController.getProduct)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;

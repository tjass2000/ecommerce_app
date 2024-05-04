const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");

//Admin Route for getting all users
router
  .route("/userDetails")
  .get(userController.getUsers)
  .post(userController.createUser);

//Admin Route to get specific user based on id
router
  .route("/userDetails/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .put(userController.updateUser);

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

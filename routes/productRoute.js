const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authController = require("../controllers/authController");

const reviewRouter = require("./reviewRoute");

router.use("/:productId/reviews", reviewRouter);

router.route("/").get(productController.getAllProducts);

router.route("/:id").get(productController.getProduct);

//Only users with authentication can access the route
router.use(authController.protect);
//All routes after this require admin level authorization
router.use(authController.restrictTo("admin"));

router.route("/").post(productController.createProduct);

router
  .route("/productDetails/:id")
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;

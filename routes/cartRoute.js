const express = require("express");
const cartController = require("../controllers/cartController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/myCart")
  .get(authController.protect, cartController.getCart)
  .post(
    authController.protect,
    cartController.setProductIds,
    cartController.addToCart
  );

router
  .route("/myCart/:id")
  .put(authController.protect, cartController.updateCart)
  .delete(authController.protect, cartController.deleteCart)
  .get(authController.protect, cartController.getOneCart);

module.exports = router;

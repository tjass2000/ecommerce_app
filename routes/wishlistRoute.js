const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const wishlistController = require("../controllers/wishlistController");

router
  .route("/myWishlist")
  .get(authController.protect, wishlistController.getAllWishlist)
  .post(
    authController.protect,
    wishlistController.setProductIds,
    wishlistController.addToWishlist
  );

router
  .route("/myWishlist/:id")
  .put(authController.protect, wishlistController.updateWishlist)
  .delete(authController.protect, wishlistController.deleteWishlist)
  .get(authController.protect, wishlistController.getOneWishlist);

module.exports = router;

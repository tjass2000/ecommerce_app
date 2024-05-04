const reviewController = require("../controllers/reviewController");
const express = require("express");
const router = express.Router({ mergeParams: true });
const authController = require("../controllers/authController");

//Reviews Route
router.use(authController.protect);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(reviewController.setProductUserIds, reviewController.createReview);

router
  .route("/:id")
  .delete(reviewController.deleteReview)
  .put(reviewController.updateReview)
  .get(reviewController.getOneReview);

module.exports = router;

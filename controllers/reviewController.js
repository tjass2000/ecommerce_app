const reviewModel = require("../models/reviewModel");
// const AppError = require("../utils/appError");
// const catchAsync = require("../utils/catchAsync");

const factory = require("../controllers/handlerFactory");

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   var filter = {};
//   if (req.params.productId) filter = { tour: req.body.productId };
//   const review = await reviewModel.find(filter);
//   if (!review) {
//     return next(new AppError("Unable to get reviews for the product", 404));
//   }
//   res.status(200).json({ stauts: "success", data: { review: review } });
// });

exports.setProductUserIds = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.params.id;
  next();
};

// exports.createReview = catchAsync(async (req, res, next) => {
//   if (!req.body.product) req.body.product = req.params.productId;
//   if (!req.body.user) req.body.user = req.params.id;
//   const newReview = await reviewModel.create(req.body);
//   if (!newReview) {
//     return next(new AppError("Unable to create review!", 404));
//   }
//   res.status(201).json({ stauts: "success", data: { review: newReview } });
// });

//Using Handler Factory Method
exports.createReview = factory.createOne(reviewModel);
exports.getAllReviews = factory.getAll(reviewModel);
exports.deleteReview = factory.deleteOne(reviewModel);
exports.updateReview = factory.updateOne(reviewModel);
exports.getOneReview = factory.getOne(reviewModel);

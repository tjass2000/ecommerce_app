const wishlistModel = require("../models/wishlistModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("../controllers/handlerFactory");

exports.setProductIds = catchAsync(async (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.id;
  if (!req.body.user) req.body.user = req.user.id;
  next();
});

exports.addToWishlist = factory.createOne(wishlistModel);
exports.getAllWishlist = factory.getAll(wishlistModel);
exports.updateWishlist = factory.updateOne(wishlistModel);
exports.deleteWishlist = factory.deleteOne(wishlistModel);
exports.getOneWishlist = factory.getOne(wishlistModel);

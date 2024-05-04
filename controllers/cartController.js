const cartModel = require("../models/cartModel");
const catchAsync = require("../utils/catchAsync");

const factory = require("../controllers/handlerFactory");

exports.setProductIds = catchAsync(async (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.id;
  if (!req.body.user) req.body.user = req.user.id;
  next();
});

exports.addToCart = factory.createOne(cartModel);
exports.getCart = factory.getAll(cartModel);
exports.updateCart = factory.updateOne(cartModel);
exports.deleteCart = factory.deleteOne(cartModel);
exports.getOneCart = factory.getOne(cartModel);

const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "productModel",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "userAuthModel",
    required: [true, "A wishlist item should belong to a user"],
  },
  quantity: {
    type: Number,
    required: [true, "A product should have a particular quantity"],
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

wishlistSchema.pre(/^find/, async function (next) {
  this.populate({
    path: "product",
    select: "product_name price description",
  });
  next();
});

const wishlistModel = mongoose.model("wishlistModel", wishlistSchema);

module.exports = wishlistModel;

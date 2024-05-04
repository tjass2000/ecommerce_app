const mongoose = require("mongoose");
const productModel = require("./productModel");
const userAuthModel = require("./userAuthModel");
const reviewSchema = new mongoose.Schema({
  //review
  review: {
    type: String,
    required: [true, "Please enter a review"],
  },
  //Rating
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  //createdAt
  createdAt: {
    type: Date,
    default: Date.now,
  },
  //ref to tour
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "productModel",
    required: [true, "Review must belong to a product"],
  },
  //ref to user
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "userAuthModel",
    required: [true, "Review should be submitted by a user"],
  },
});

reviewSchema.pre(/^find/, async function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

const reviewModel = mongoose.model("reviewModel", reviewSchema);

module.exports = reviewModel;

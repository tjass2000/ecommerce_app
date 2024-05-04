const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "productModel",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "userAuthModel",
    required: [true, "A cart item should belong to a user"],
  },
  quantity: {
    type: Number,
    required: [true, "A cart item should have a specific quantity"],
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  //create a sub entity with total of cart
  //address
});

cartSchema.pre(/^find/, async function (next) {
  this.populate({
    path: "product",
    select: "product_name price description",
  });
  next();
});

const cartModel = mongoose.model("cartModel", cartSchema);
module.exports = cartModel;

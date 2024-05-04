const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "productModel",
    required: [true, "An order should be placed for a product!"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "userAuthModel",
    required: [true, "An order should be placed by a user!"],
  },
  price: {
    type: Number,
    required: [true, "The order must have a price!"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

orderSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "product",
    select: "name",
  });
});

const orderModel = mongoose.model("orderModel", orderSchema);

module.exports = orderModel;

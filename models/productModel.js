const mongoose = require("mongoose");

//Basic schema for the database
const productSchema = mongoose.Schema({
  product_name: {
    type: String,
    required: [true, "Name should always have a value"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Category is required field"],
  },
  price: {
    type: Number,
    required: [true, "Price is a required field"],
  },
  description: {
    type: String,
  },
});
//Data model based on the schema
const productModel = mongoose.model("productModel", productSchema);

module.exports = productModel;

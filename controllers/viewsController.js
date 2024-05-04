const productModel = require("../models/productModel");

exports.getOverview = async (req, res) => {
  const productData = await productModel.find();
  res.status(200).render("base", {
    title: "Ecommerce App",
    productData,
  });
};

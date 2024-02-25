const productModel = require("../models/productModel");

exports.getHomePage = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const queryStr = JSON.stringify(queryObj);
    let result = await productModel.find(JSON.parse(queryStr));
    res.status(200).json({ status: "success", data: { result } });
  } catch (err) {
    res.status(400).json({ status: "failed", response: { err } });
  }
};

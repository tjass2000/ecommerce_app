const productModel = require("../models/productModel");
const userAuthModel = require("../models/userAuthModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const factory = require("../controllers/handlerFactory");

/////Admin Controls//////////
//Control to Get All Products
//Using Factory Handler Method
exports.getAllProducts = factory.getAll(productModel);

// exports.getAllProducts = catchAsync(async (req, res, next) => {
//   const productRouteFeatures = new APIFeatures(productModel.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   // const queryObj = { ...req.query };
//   // const queryStr = JSON.stringify(queryObj);
//   // let result = await productModel.find(JSON.parse(queryStr));
//   let result = await productRouteFeatures.query;

//   if (!result) {
//     return next(new AppError("No product found with that ID", 404));
//   }

//   res.status(200).json({ status: "success", data: { result } });
//   // try {
//   // } catch (err) {
//   //   res.status(400).json({ status: "failed", data: { err } });
//   // }
// });

//Control to Get Product based on id
//Using Factory Handler Method
exports.getProduct = factory.getOne(productModel, { path: "reviews" });

// exports.getProduct = catchAsync(async (req, res, next) => {
//   const id = req.params.id;
//   let result = await productModel.findById(id).populate("reviews");

//   if (!result) {
//     return next(new AppError("No product found with that ID", 404));
//   }

//   res.status(200).json({ status: "success", data: { result } });
//   //   try {
//   // } catch (err) {
//   //     res.status(400).json({ status: "failed", data: { err } });
//   //   }
// });

//Control to create new product
//Using Factory Handler
exports.createProduct = factory.createOne(productModel);

// exports.createProduct = catchAsync(async (req, res, next) => {
//   const payload = req.body;
//   let result = await productModel.create(payload);

//   if (!result) {
//     return next(new AppError("No product found with that ID", 404));
//   }

//   res.status(200).json({ status: "success", data: { result } });
//   // try {
//   // } catch (err) {
//   //   res.status(400).json({ status: "failed", data: { err } });
//   // }
// });

//Control to update existing product
//Using Factory Handler
exports.updateProduct = factory.updateOne(productModel);

// exports.updateProduct = catchAsync(async (req, res, next) => {
//   const id = req.params.id;
//   const payload = req.body;
//   let result = await productModel.findByIdAndUpdate(id, payload);

//   if (!result) {
//     return next(new AppError("No product found with that ID", 404));
//   }

//   res.status(200).json({ status: "success", data: { result } });
//   // try {
//   // } catch (err) {
//   //   res.status(400).json({ status: "failed", data: { err } });
//   // }
// });

//Control to delete existing product based on id
//Using handler factory functions
exports.deleteProduct = factory.deleteOne(productModel);

// exports.deleteProduct = catchAsync(async (req, res, next) => {
//   const id = req.params.id;
//   let result = await productModel.findByIdAndDelete(id);

//   if (!result) {
//     return next(new AppError("No product found with that ID", 404));
//   }

//   res.status(200).json({ status: "success", data: { result } });
//   // try {
//   // } catch (err) {
//   //   res.status(400).json({ status: "failed", data: { err } });
//   // }
// });
/////Admin Controls//////////

//Wishlist Controls
//Get Product from Wishlist
exports.getProdFrWishlist = catchAsync(async (req, res, next) => {
  const decoded_token = jwt.decode(req.cookies.jwt);
  const user_id = decoded_token.user_id;

  const user = await userAuthModel.findById(user_id);
  const result = user.wishlistItems;
  res.status(200).json({ status: "success", data: { result } });
  // try {
  // } catch (err) {
  //   res.status(400).json({ status: "success", data: { err } });
  // }
});

//Add Product to Wishlist
exports.addToWishlist = catchAsync(async (req, res, next) => {
  const decoded_token = jwt.decode(req.cookies.jwt);
  const user_id = decoded_token.user_id;

  let wishlist = await userAuthModel.findById(user_id);
  const { product_name, category, price, description } = req.body;
  wishlist.wishlistItems.push({
    product_name,
    category,
    price,
    description,
  });
  wishlist = await wishlist.save();
  res.status(200).json({ status: "success", data: { wishlist } });
  //   try {
  // } catch (err) {
  //     res.status(400).json({ status: "failed", data: { err } });
  //   }
});

//Delete from Wishlist

//Cart Control
//Get Product from Cart
exports.getProdFrCart = catchAsync(async (req, res, next) => {
  const decoded_token = jwt.decode(req.cookies.jwt);
  const user_id = decoded_token.user_id;

  const user = await userAuthModel.findById(user_id);
  const result = user.cartItems;
  res.status(200).json({ status: "success", data: { result } });
  // try {
  // } catch (err) {
  //   res.status(400).json({ status: "failed", data: { err } });
  // }
});

//Add Product to Cart
exports.addToCart = catchAsync(async (req, res, next) => {
  const decoded_token = jwt.decode(req.cookies.jwt);
  const user_id = decoded_token.user_id;

  let cart = await userAuthModel.findById(user_id);
  const { product_name, category, price, description, quantity } = req.body;
  cart.cartItems.push({
    product_name,
    category,
    price,
    description,
    quantity,
  });
  cart = await cart.save();
  res.status(200).json({ status: "success", data: { cart } });
  //   try {
  // } catch (err) {
  //   res.status(400).json({ status: "failed", data: { err } });
  //   }
});

//Delete from Cart
exports.delFrCart = catchAsync(async (req, res, next) => {
  const decoded_token = jwt.decode(req.cookies.jwt);
  const user_id = decoded_token.user_id;

  let cart = await userAuthModel.findById(user_id);
  if (req.params.id === cart.cartItems.id) {
    const result = "Result";
    res.status(200).json({ status: "success", data: { result } });
  }
  // try {
  // } catch (err) {
  //   res.status(400).json({ status: "failed", data: { err } });
  // }
});

//Get Order Details
exports.getOrder = catchAsync(async (req, res, next) => {
  const decoded_token = jwt.decode(req.cookies.jwt);
  const user_id = decoded_token.user_id;

  const user = await userAuthModel.findById(user_id);
  const result = user.cartItems;
  res.status(200).json({ status: "success", data: { result } });
  // try {
  // } catch (err) {
  //   res.status(400).json({ status: "failed", data: { err } });
  // }
});
//Post Order Details
exports.postOrder = catchAsync(async (req, res, next) => {
  const decoded_token = jwt.decode(req.cookies.jwt);
  const user_id = decoded_token.user_id;

  let order = await userAuthModel.findById(user_id);
  const { product_name, category, price, description, quantity } = req.body;
  order.orderItems.push({
    product_name,
    category,
    price,
    description,
    quantity,
  });
  order = await order.save();
  res.status(201).json({ status: "success", data: { order } });
  // try {
  // } catch (err) {
  //   res.status(400).json({ status: "failed", data: { err } });
  // }
});
//Order Cancellation
exports.delOrder = catchAsync(async (req, res, next) => {
  const decoded_token = jwt.decode(req.cookies.jwt);
  const user_id = decoded_token.user_id;

  let order = await userAuthModel.findById(user_id);
  if (req.params.id === order.orderItems.id) {
    const result = "Result";
    res.status(200).json({ status: "success", data: { result } });
  }
  // try {
  // } catch (err) {
  //   res.status(400).json({ status: "failed", data: { err } });
  // }
});

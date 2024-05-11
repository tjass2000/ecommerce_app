const productModel = require("../models/productModel");
const userAuthModel = require("../models/userAuthModel");
const wishlistModel = require("../models/wishlistModel");

exports.getOverview = async (req, res) => {
  const productData = await productModel.find();
  res.status(200).render("overview", {
    title: "Ecommerce App",
    productData,
  });
};

exports.getLoginPage = async (req, res) => {
  res.status(200).render("login", {
    title: "Ecommerce App - Login",
  });
};

exports.getSignUpPage = async (req, res) => {
  res.status(200).render("signup", {
    title: "Ecommerce App - Signup",
  });
};

exports.getMyAccount = async (req, res) => {
  // const user = await userAuthModel.find();
  res.status(200).render("profile", {
    title: "Ecommerce App - My Account",
    user: req.user,
  });
};

exports.getMyWishlist = async (req, res) => {
  const wishlistItem = await wishlistModel.find({ user: req.user.id });
  res.status(200).render("wishlist", {
    title: "Ecommerce App - Wishlist",
    productData: wishlistItem,
  });
};

exports.getMyCart = async (req, res) => {
  res.status(200).render("cart", {
    title: "Ecommerce App - Cart",
  });
};

exports.updateUserData = async (req, res) => {
  const user = await userAuthModel.findByIdAndUpdate(req.user.id, {
    name: req.body.name,
    email: req.body.email,
  });
  res.status(200).render("profile", {
    title: "Ecommerce App - My Account",
    user: user,
  });
};

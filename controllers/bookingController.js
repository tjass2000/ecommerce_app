const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const productModel = require("../models/productModel");

exports.getBookingSession = catchAsync(async (req, res, next) => {
  //1. Get the user
  const product = await productModel.findById(req.params.productId);

  //2. Create stripe session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${req.protocol}://${req.get("host")}/products`,
    customer_email: req.user.email,
    client_reference_id: req.params.productId,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.product_name,
            description: product.description,
          },
          unit_amount: `${Math.round(product.price)}`,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
  });

  //3. Send the response
  res.status(200).json({ status: "Success", session });
});

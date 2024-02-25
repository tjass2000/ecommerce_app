const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

//Basic schema for the database
const userAuthSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name should always have a value"],
    unique: true,
    trim: true,
  },
  phoneNumber: {
    type: Number,
    required: [true, "Phone number is required field"],
  },
  email: {
    type: String,
    require: [true, "Please provide an email address"],
    validate: [validator.isEmail, "Please provdie a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is a required field"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password!!"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Please confirm the password!!",
    },
  },
  wishlistItems: [
    {
      product_name: String,
      category: String,
      price: Number,
      description: String,
    },
  ],
  cartItems: [
    {
      product_name: String,
      category: String,
      price: Number,
      description: String,
      quantity: Number,
    },
  ],
  orderItems: [
    {
      product_name: String,
      category: String,
      price: Number,
      description: String,
      quantity: Number,
    },
  ],
});

userAuthSchema.pre("save", async function (next) {
  //Execute only when passwords are modified
  if (!this.isModified("password")) return next();

  //Emcrypt the password and store to database
  this.password = await bcrypt.hash(this.password, 12);
  //keep passwordConfirm undefined because not needed anymore
  this.passwordConfirm = undefined;
});

userAuthSchema.methods.correctPassword = function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};
//Data model based on the schema
const userAuthModel = mongoose.model("userAuthModel", userAuthSchema);

module.exports = userAuthModel;

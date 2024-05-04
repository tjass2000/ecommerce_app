const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const crypto = require("crypto");

//Basic schema for the database
const userAuthSchema = mongoose.Schema(
  {
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
    role: {
      type: String,
      enum: ["user", "admin"],
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
    photo: {
      type: String,
      default: "default.png",
    },
    // wishlistItems: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "productModel",
    //   },
    // ],
    // cartItems: [
    //   {
    //     product_name: String,
    //     category: String,
    //     price: Number,
    //     description: String,
    //     quantity: Number,
    //   },
    // ],
    // orderItems: [
    //   {
    //     product_name: String,
    //     category: String,
    //     price: Number,
    //     description: String,
    //     quantity: Number,
    //   },
    // ],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userAuthSchema.virtual("wishlistItems", {
  ref: "wishlistModel",
  foreignField: "user",
  localField: "_id",
});

userAuthSchema.virtual("cartItems", {
  ref: "cartModel",
  foreignField: "user",
  localField: "_id",
});

//Deactivating user account
userAuthSchema.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userAuthSchema.pre("save", async function (next) {
  //Execute only when passwords are modified
  if (!this.isModified("password")) return next();

  //Emcrypt the password and store to database
  this.password = await bcrypt.hash(this.password, 12);
  //keep passwordConfirm undefined because not needed anymore
  this.passwordConfirm = undefined;
});

//Updating the passwordChangedAt property
userAuthSchema.pre("save", function (next) {
  if (this.isModified("passwordChangedAt") || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//Password validation for encrypted passwords
userAuthSchema.methods.correctPassword = function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

//Checking if password is changed after token creation
userAuthSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000);
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

//Password reset instance method
userAuthSchema.methods.createPasswordResetToken = function () {
  var resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  console.log(resetToken);
  return resetToken;
};

//Data model based on the schema
const userAuthModel = mongoose.model("userAuthModel", userAuthSchema);

module.exports = userAuthModel;

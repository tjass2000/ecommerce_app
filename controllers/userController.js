const userAuthModel = require("../models/userAuthModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
// const sharp = require("sharp");

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public");
//   },
//   filename: (req, file, cb) => {
//     var ext = file.mimetype.split("/")[1];
//     cb(null, `user-${ext}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload an image file.", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const factory = require("./handlerFactory");

const filteredObj = (data, ...allowedfields) => {
  const newObj = {};
  Object.keys(data).forEach((el) => {
    if (allowedfields.includes(el)) {
      newObj[el] = data[el];
    }
  });
  return newObj;
};

exports.uploadMyPhoto = upload.single("photo");

exports.getUsers = factory.getAll(userAuthModel);

// exports.getUsers = async (req, res) => {
//   try {
//     const queryObj = { ...req.query };
//     const queryStr = JSON.stringify(queryObj);
//     let query = await userAuthModel.find(JSON.parse(queryStr));
//     res.status(200).json({ status: "success", data: { query } });
//   } catch (err) {
//     res.status(400).json({ status: "Invalid query", data: { err } });
//   }
// };

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.resizeUserPhoto = (req, res, next) => {
  if (!res.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.json`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/${req.file.filename}`);

  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //If user tries to update password give error
  console.log(req.file);
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "You can't update password here. Please go to the specific route!!",
        400
      )
    );
  }

  var filteredBody = filteredObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await userAuthModel.findByIdAndUpdate(
    req.user._id,
    filteredBody,
    { new: true, runValidators: true }
  );
  res.status(200).json({ status: "success", data: { user: updatedUser } });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await userAuthModel.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: "success", data: null });
});

//Using Factory Handler Method
exports.getUser = factory.getOne(userAuthModel, {
  path: "wishlistItems cartItems",
});

// exports.getUser = async (req, res) => {
//   try {
//     const index = req.params.id;
//     let query = await userAuthModel.findById(index);
//     res.status(200).json({ status: "success", data: { query } });
//   } catch (err) {
//     res.status(400).json({ status: "Invalid query", data: { err } });
//   }
// };

//Using Factory Handler
exports.createUser = factory.createOne(userAuthModel);

// exports.createUser = async (req, res) => {
//   try {
//     const payload = req.body;
//     let result = await userAuthModel.create(payload);
//     res.status(201).json({ status: "success", data: { result } });
//   } catch (err) {
//     res.status(400).json({ status: "Invalid data format", data: { err } });
//   }
// };

//Using Factory Handler Method
exports.deleteUser = factory.deleteOne(userAuthModel);

// exports.deleteUser = async (req, res) => {
//   try {
//     const id = req.params.id;
//     let result = await userAuthModel.findByIdAndDelete(id);
//     res.status(200).json({ status: "success" });
//   } catch (err) {
//     res.status(400).json({ status: "Invalid query", data: { err } });
//   }
// };

//Using Factory Handler Method
exports.updateUser = factory.updateOne(userAuthModel);

// exports.updateUser = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const payload = req.body;
//     let result = await userAuthModel.findByIdAndUpdate(id, payload);
//     res.status(201).json({ status: "success", newData: result });
//   } catch (err) {
//     res.status(400).json({ status: "Invalid data format", newData: { err } });
//   }
// };

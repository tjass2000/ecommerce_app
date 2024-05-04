const APIFeatures = require("../utils/APIFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({ status: "success", data: { doc } });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({ status: "success", data: { doc } });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({ status: "success", data: { doc } });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No doc found with that ID", 404));
    }

    res.status(200).json({ status: "success", data: { doc } });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    var filter = {};
    if (req.params.productId) filter = { tour: req.body.productId };
    const routeFeatures = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    let doc = await routeFeatures.query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({ status: "success", data: { doc } });
    // try {
    // } catch (err) {
    //   res.status(400).json({ status: "failed", data: { err } });
    // }
  });

const userAuthModel = require("../models/userAuthModel");

exports.getUsers = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const queryStr = JSON.stringify(queryObj);
    let query = await userAuthModel.find(JSON.parse(queryStr));
    res.status(200).json({ status: "success", data: { query } });
  } catch (err) {
    res.status(400).json({ status: "Invalid query", data: { err } });
  }
};

exports.getUser = async (req, res) => {
  try {
    const index = req.params.id;
    let query = await userAuthModel.findById(index);
    res.status(200).json({ status: "success", data: { query } });
  } catch (err) {
    res.status(400).json({ status: "Invalid query", data: { err } });
  }
};

exports.createUser = async (req, res) => {
  try {
    const payload = req.body;
    let result = await userAuthModel.create(payload);
    res.status(201).json({ status: "success", data: { result } });
  } catch (err) {
    res.status(400).json({ status: "Invalid data format", data: { err } });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    let result = await userAuthModel.findByIdAndDelete(id);
    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(400).json({ status: "Invalid query", data: { err } });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    let result = await userAuthModel.findByIdAndUpdate(id, payload);
    res.status(201).json({ status: "success", newData: result });
  } catch (err) {
    res.status(400).json({ status: "Invalid data format", newData: { err } });
  }
};

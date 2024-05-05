const express = require("express");
const router = express.Router();
const viewController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

//Base view route
router.get("/", viewController.getOverview);

module.exports = router;

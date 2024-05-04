const express = require("express");
const router = express.Router();
const viewController = require("../controllers/viewsController");

//Base view route
router.get("/", viewController.getOverview);

module.exports = router;

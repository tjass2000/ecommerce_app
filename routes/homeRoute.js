const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

//Home Page Route without login credentials
router.route("/home").get(homeController.getHomePage);

module.exports = router;

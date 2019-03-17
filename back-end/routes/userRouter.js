const express = require("express");
const router = express.Router();

var UserController = require("../controllers/userController");

router.post("/adduser", UserController.add_user);

module.exports = router;

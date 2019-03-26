const express = require("express");
const router = express.Router();

var UserController = require("../controllers/userController");

router.post("/adduser", UserController.add_user);
router.post("/verify", UserController.verify);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.post("/resendverification", UserController.resend_verification);
router.get("/user/:id", UserController.getUserInfo)

module.exports = router;

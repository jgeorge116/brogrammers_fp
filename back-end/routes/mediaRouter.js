const express = require("express");
const router = express.Router();

var MediaController = require("../controllers/mediaController");

router.post("/addmedia", MediaController.add_media);
router.get("/media/:id", MediaController.get_media_by_id);

module.exports = router;

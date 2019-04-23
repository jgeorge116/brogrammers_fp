const express = require("express");
const router = express.Router();
const ResetRepository = require("../repositories/resetRespository");
const RP = new ResetRepository();


router.post("/", function(req, res) {   res.set("Content-Type", "text/html");
  res.send(new Buffer("<h1>Hello World</h1>"));
 });

router.get("/reset", function(req, res) {
    RP.reset_databases();
    res.send({status: 'OK'});
});

module.exports = router;

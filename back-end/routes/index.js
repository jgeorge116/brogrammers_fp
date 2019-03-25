const express = require("express");
const router = express.Router();

router.post("/", function (req, res) {
    res.set('Content-Type', 'text/html');
res.send(new Buffer('<h1>Hello World</h1>'));
});

module.exports = router;
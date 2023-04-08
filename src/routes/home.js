const express = require("express");
const router = express.Router();

router.route("/").get((req, res) => {
  res.send("home page");
});

module.exports = router;

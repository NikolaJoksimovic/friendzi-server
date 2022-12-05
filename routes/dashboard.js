const express = require("express");
const router = express.Router();

const findUser = require("../controllers/dashboard");

router.route("/finduser").post(findUser);

module.exports = router;

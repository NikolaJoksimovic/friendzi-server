const express = require("express");
const router = express.Router();

const updateUser = require("../controllers/onboarding");

router.route("/updateuser").patch(updateUser);

module.exports = router;

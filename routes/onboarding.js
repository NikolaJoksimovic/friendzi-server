const express = require("express");
const router = express.Router();

const { updateUser, getUserInfo } = require("../controllers/onboarding");

router.route("/updateuser").patch(updateUser);
router.route("/getuserinfo").post(getUserInfo);

module.exports = router;

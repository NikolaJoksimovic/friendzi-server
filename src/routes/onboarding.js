const express = require("express");
const router = express.Router();

const {
  updateUser,
  getUserInfo,
  uploadUserImg,
} = require("../controllers/onboarding");

router.route("/updateuser").patch(updateUser);
router.route("/getuserinfo").post(getUserInfo);
router.route("/uploadimg").post(uploadUserImg);

module.exports = router;

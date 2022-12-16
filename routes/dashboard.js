const express = require("express");
const router = express.Router();

const {
  findUser,
  bookEvent,
  getUserEvetns,
} = require("../controllers/dashboard");

router.route("/finduser").post(findUser);
router.route("/bookevent").post(bookEvent);
router.route("/myevents").post(getUserEvetns);

module.exports = router;

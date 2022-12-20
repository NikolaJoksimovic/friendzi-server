const express = require("express");
const router = express.Router();

const {
  findUser,
  bookEvent,
  getUserEvetns,
  findEvent,
  getAllEventUsers,
} = require("../controllers/dashboard");

router.route("/finduser").post(findUser);
router.route("/findevent").post(findEvent);
router.route("/bookevent").post(bookEvent);
router.route("/myevents").post(getUserEvetns);
router.route("/event/users").post(getAllEventUsers);

module.exports = router;

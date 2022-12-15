const express = require("express");
const router = express.Router();

const { findUser, bookEvent } = require("../controllers/dashboard");

router.route("/finduser").post(findUser);
router.route("/bookevent").post(bookEvent);

module.exports = router;

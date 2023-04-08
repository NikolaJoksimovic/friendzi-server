const express = require("express");
const router = express.Router();

const {
  getUserEvetns,
  updateChatLog,
  getChatHistory,
} = require("../controllers/my_events");

router.route("/").post(getUserEvetns);
router.route("/update_chat_log").post(updateChatLog);
router.route("/get_chat_history").post(getChatHistory);

module.exports = router;

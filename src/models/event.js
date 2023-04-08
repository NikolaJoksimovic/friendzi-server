const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  event_id: {
    type: String,
  },
  users: [
    {
      type: String,
    },
  ],
  messages: [
    {
      user_id: { type: String },
      room_id: { type: String },
      msg: { type: String },
      userInfo: {
        firstName: { type: String },
        lastName: { type: String },
      },
      time: { type: String },
    },
  ],
});

module.exports = mongoose.model("Event", eventSchema);

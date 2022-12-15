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
});

module.exports = mongoose.model("Event", eventSchema);

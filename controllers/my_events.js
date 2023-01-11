const User = require("../models/user");
const Event = require("../models/event");
const { BadRequestError, CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { filterInvalidEvents } = require("../functions/dashboard");

// GET USER EVENTS
const getUserEvetns = async (req, res) => {
  const { user_id } = { ...req.body };
  const user = await User.findOne({ user_id: user_id });
  if (!user) {
    throw new CustomAPIError(
      "Server is currently busy... Please try again later."
    );
  }
  const events = user.events;
  const eventsArray = Object.entries(events).map((entrie) => {
    return entrie[1];
  });

  try {
    const validEvents = await filterInvalidEvents(eventsArray, user_id);
    return res.status(StatusCodes.OK).json(validEvents);
  } catch (error) {
    throw new BadRequestError("Something went wrong. Couldn't filter events.");
  }
};

// UPDATE CHAT LOG
const updateChatLog = async (req, res) => {
  const { data, event_id } = { ...req.body };
  const response = await Event.findOneAndUpdate(
    { event_id: event_id },
    { $push: { messages: data } }
  );
  if (!response) {
    throw new CustomAPIError(
      "Something went wrong. Couldn't update the chat log."
    );
  }
  res.send("");
};

// GET CHAT HISTORY
const getChatHistory = async (req, res) => {
  const { room_id } = { ...req.body };
  const response = await Event.findOne({ event_id: room_id });
  if (!response) {
    throw new CustomAPIError(
      "Something went wrong. Couldn't find the chat log."
    );
  }
  res.status(StatusCodes.OK).json({ data: response.messages });
};

module.exports = {
  getUserEvetns,
  updateChatLog,
  getChatHistory,
};

const User = require("../models/user");
const Event = require("../models/event");
const {
  AuthenticationError,
  BadRequestError,
  CustomAPIError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");
const user = require("../models/user");
const event = require("../models/event");
const { filterInvalidEvents } = require("../functions/dashboard");

// FIND USER
const findUser = async (req, res) => {
  const { user_id } = {
    ...req.body,
  };
  const user = await User.findOne({ user_id: user_id });
  if (!user) {
    throw new AuthenticationError("Could find the user with current id");
  }
  res
    .status(StatusCodes.OK)
    .json({ firstName: user.firstName, lastName: user.lastName });
};

// FIND EVENT
const findEvent = async (req, res) => {
  const { event_id } = { ...req.body };
  const event = await Event.findOne({ event_id: event_id });
  if (!event) {
    throw new BadRequestError(
      "Server is currently busy... Please try again later."
    );
  }
  res.status(StatusCodes.OK).json({ users: event.users });
};

// BOOK EVENT
const bookEvent = async (req, res) => {
  const { event_id, user_id } = { ...req.body };
  const user = await User.findOne({ user_id });
  if (!user) {
    throw new CustomAPIError(
      "Server is currently busy... Please try again later."
    );
  } else {
    const userEvents = user.events;
    if (userEvents.length != 0) {
      throw new BadRequestError(
        "You already have a booked event. Check your schedule."
      );
    }
  }

  let event = await Event.findOne({ event_id });
  if (!event) {
    try {
      event = await Event.create({ event_id: event_id, users: [user_id] });
      await User.findOneAndUpdate({ user_id }, { events: [event_id] });
    } catch (error) {
      throw new CustomAPIError(
        "Server is currently busy... Please try again later."
      );
    }
  } else {
    // change to 5 later
    if (event.users.length === 5) {
      throw new BadRequestError("This date and time is already booked.");
    }
    try {
      const newUsers = event.users;
      newUsers.push(user_id);
      await Event.findOneAndUpdate({ event_id: event_id }, { users: newUsers });
      await User.findOneAndUpdate({ user_id: user_id }, { events: [event_id] });
    } catch (error) {
      throw new CustomAPIError(
        "Server is currently busy... Please try again later."
      );
    }
  }

  res.send({ ...req.body });
};

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

// GET ALL USERS FOR AN EVENT
const getAllEventUsers = async (req, res) => {
  const { users } = { ...req.body };
  const response = await Promise.all(
    users.map(async (userId) => {
      const userData = await User.findOne({ user_id: userId });
      const { dob, firstName, lastName, sex, workingStatus } = userData;
      return {
        user_id: userId,
        dob: dob,
        firstName: firstName,
        lastName: lastName,
        sex: sex,
        workingStatus: workingStatus,
      };
    })
  );
  if (!response) {
    throw new BadRequestError("Something went wrong. Couldn't filter events.");
  }
  res.status(StatusCodes.OK).json(response);
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
  findUser,
  bookEvent,
  getUserEvetns,
  findEvent,
  getAllEventUsers,
  updateChatLog,
  getChatHistory,
};

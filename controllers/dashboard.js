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

// FIND USER
const findUser = async (req, res) => {
  const { userId } = {
    ...req.body,
  };
  const user = await User.findOne({ user_id: userId });
  if (!user) {
    throw new AuthenticationError("Could find the user with current id");
  }
  console.log(user);
  res
    .status(StatusCodes.OK)
    .json({ firstName: user.firstName, lastName: user.lastName });
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
      console.log(error);
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

const getUserEvetns = async (req, res) => {
  const { user_id } = { ...req.body };
  const user = await User.findOne({ user_id: user_id });
  if (!user) {
    throw new CustomAPIError(
      "Server is currently busy... Please try again later."
    );
  }
  const events = user.events;
  const responsePackage = Object.entries(events).map((entrie) => {
    const responseString = '{"event_id":' + `"${entrie[1]}"}`;
    console.log({ responseString });
    return JSON.parse(responseString);
  });
  console.log(responsePackage);

  res.status(StatusCodes.OK).json(events);
};

module.exports = { bookEvent, findUser, getUserEvetns };

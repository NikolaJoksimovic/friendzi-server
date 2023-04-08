const { CustomAPIError } = require("../errors");
const User = require("../models/user");
const Event = require("../models/event");

const isEventValid = function (event) {
  const currDate = new Date();
  const day = event.substring(0, 2);
  const month = event.substring(2, 4);
  const hours = event.substring(4, 6);

  // make new date for event
  const eventDate = new Date();
  eventDate.setMonth(month - 1);
  eventDate.setDate(day);
  eventDate.setHours(hours);

  return (
    eventDate.getTime() > currDate.getTime() &&
    eventDate.getDate() < currDate.getDate() + 7
  );
};

const deleteInvalidEvents = async () => {
  const response = await Event.find({});
  if (!response) {
    throw new CustomAPIError(
      "Server is currently busy... Couldn't find all events."
    );
  }
  response.map(async (event) => {
    const eventId = event.event_id;
    if (!isEventValid(eventId)) {
      await Event.findOneAndRemove({ event_id: eventId });
    }
  });
};

// FILTER INVALID EVENTS
const filterInvalidEvents = async (array, user_id) => {
  const currDate = new Date();
  const validEvents = array.filter((event) => {
    // event example: '18122100cocktails'
    return isEventValid(event);
  });

  validEvents.sort(function (a, b) {
    const ad = a.substring(0, 2);
    const am = a.substring(2, 4);
    const bd = b.substring(0, 2);
    const bm = b.substring(2, 4);
    return am + 1 === bm ? -1 : am === bm ? (ad < bd ? -1 : 1) : 1;
  });

  await User.findOneAndUpdate({ user_id: user_id }, { events: validEvents });
  return validEvents;
};

module.exports = { deleteInvalidEvents, filterInvalidEvents, isEventValid };

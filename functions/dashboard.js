const { BadRequestError } = require("../errors");
const User = require("../models/user");

const filterInvalidEvents = async (array, user_id) => {
  const currDate = new Date();
  const validEvents = array.filter((event) => {
    // event example: '18122100cocktails'
    const day = event.substring(0, 2);
    const month = event.substring(2, 4);
    const hours = event.substring(4, 6);

    // make new date for event
    const eventDate = new Date();
    eventDate.setMonth(month - 1);
    eventDate.setDate(day);
    eventDate.setHours(hours);

    return eventDate.getTime() > currDate.getTime();
    // maybe delete the event here if its the last user.
  });

  validEvents.sort(function (a, b) {
    const ad = a.substring(0, 2);
    const am = a.substring(2, 4);
    const bd = b.substring(0, 2);
    const bm = b.substring(2, 4);
    return am + 1 === bm ? -1 : am === bm ? (ad < bd ? -1 : 1) : 1;
  });

  const user = await User.findOneAndUpdate(
    { user_id: user_id },
    { events: validEvents }
  );
  if (!user)
    throw new BadRequestError(
      "Server is busy right now... Please try again later."
    );

  return validEvents;
};

module.exports = { filterInvalidEvents };

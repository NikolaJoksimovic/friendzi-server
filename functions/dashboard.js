const { BadRequestError } = require("../errors");
const User = require("../models/user");

const filterInvalidEvents = async (array, user_id) => {
  console.log("starting array:" + array);

  const currDate = new Date();
  // event example: '18122100cocktails'
  const validEvents = array.filter(
    (event) =>
      event.substring(2, 4) > currDate.getMonth() ||
      (event.substring(2, 4) === currDate.getMonth() &&
        event.substring(0, 2) > currDate.getDate()) ||
      event.substring(4, 6) > currDate.getHours()
  );

  validEvents.sort(function (a, b) {
    const ad = a.substring(0, 2);
    const am = a.substring(2, 4);
    const bd = b.substring(0, 2);
    const bm = b.substring(2, 4);
    return am + 1 === bm ? -1 : am === bm ? (ad < bd ? -1 : 1) : 1;
  });

  console.log("valid events:" + validEvents);
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

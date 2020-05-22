const { getConnection } = require("../connection/connection");
//env vairables
require("dotenv").config();

const {
  getEventByIdRepo,
  getParticipantsByIdRepo,
} = require("../repositories/joinLeaveCancelRepository");

//------------------SERVICE-----------------------
// the brains of the application, they control any payload manipulation/validation
//---------------------------------------------------

//get a user by _id in the user collection.
const getEventById = async (eventId) => {
  // //grab the event
  const checkForEvent = await getEventByIdRepo(eventId);
  if (!checkForEvent) {
    return;
  }
  return checkForEvent;
};

//getParticipants for that selected event.
const getParticipantsById = async (eventParticipantId) => {
  //see if there is a participant ID in that event. If so then there are at least 1 participant.
  //if there is a participant ID.
  //check if that participant doesnt already exist... in that event.
  const getParticipants = await getParticipantsByIdRepo(eventParticipantId);
  if (!getParticipants) {
    return;
  }
  return getParticipants;
};

//find matching participant
const getMatchingParticipant = (getParticipants, participantUserId) => {
  return getParticipants.participants.find((participant) => {
    if (participant.userId === participantUserId) {
      return participant;
    } else return;
  });
};
module.exports = { getEventById, getParticipantsById, getMatchingParticipant };
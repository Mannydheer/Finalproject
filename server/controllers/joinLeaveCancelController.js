"use strict";

const dbName = "ParkGames";
const collectionEvents = "Events";
const collectionParticipants = "Participants";
const collectionUserEvents = "UserEvents";
const collectionRooms = "Rooms";
const assert = require("assert");
var ObjectId = require("mongodb").ObjectID;
//env vairables
require("dotenv").config();
const {
  //handleJoinEvent.
  getEventById,
  getParticipantsById,
  getMatchingParticipant,
  addParticipant,
  addUserEvent,
  removeParticipant,
  removeUserEvent,
  //handleLeaveEvent.

  //handleCancelEvent.
} = require("../services/joinLeaveCancelService");

//@endpoint POST /joinEvent
//@desc join the event selected from ViewActivity component.
//@access PRIVATE - will need to validate token? YES
const handleJoinEvent = async (req, res, next) => {
  const participantDetails = req.body.participantDetails;
  const eventInformation = req.body.eventInformation;
  try {
    let getEvent = await getEventById(eventInformation._id);
    //see if there is a participant ID in that event. If so then there are at least 1 participant.
    //if there is a participant ID.
    //check if that participant doesnt already exist... in that event.
    let getParticipants = await getParticipantsById(getEvent.participantId);
    //if you get participants. Which you will 100% because if you have a apeticipant ID then there are participants
    if (getParticipants && getEvent) {
      //check if any of the participants in the array match the current participant trying to join.
      let existingParticipant = getMatchingParticipant(
        getParticipants,
        participantDetails.userId
      );
      //if they do match...
      if (existingParticipant) {
        res.status(400).json({
          status: 400,
          message: "You are already registered in this event.",
        });
      } else {
        //if you don't find a matching participant.
        //add the incoming participant to that.
        let updateParticipant = await addParticipant(
          eventInformation.participantId,
          participantDetails
        );
        //when signing up, you create a _id = to the userId in the collectionUserEvents.
        //now we will push the event id in the array in this event to keep track of which events the user JOINED!
        let updateUserEvent = await addUserEvent(
          participantDetails.userId,
          participantDetails.eventId
        );
        if (updateUserEvent && updateParticipant) {
          res
            .status(200)
            .json({ status: 200, message: "Successfully joined the event!" });
        }
      }
    }
  } catch (error) {
    console.log(error.stack, "Catch Error in handleJoinEvent");
    res.status(500).json({ status: 500, message: error.message });
  }
};

//@endpoint POST /leaveEvent
//@desc leave the event selected from ViewActivity comp.
//@access PRIVATE - will need to validate token? YES
const handleLeaveEvent = async (req, res, next) => {
  const participantDetails = req.body.participantDetails;
  const eventInformation = req.body.eventInformation;
  try {
    //now you have the participant ID.
    //now get all the participants related to that event.
    //removing participants
    //find the participant collect from the event ParticipantId key.
    //now within that, remove the participant
    let updateParticipant = await removeParticipant(
      eventInformation.participantId,
      participantDetails.userId
    );
    let updateUserEvent = await removeUserEvent(
      participantDetails.userId,
      eventInformation._id
    );
    if (updateParticipant && updateUserEvent) {
      res
        .status(200)
        .json({ status: 200, message: "Successfully left the event!" });
    }
  } catch (error) {
    console.log(error.stack, "Catch Error in handleLeaveEvent");
    res.status(500).json({ status: 500, message: error.message });
  }
};
module.exports = { handleJoinEvent, handleLeaveEvent };

import dbInstance from "./dbInstance";
import { SubmissionDuration, VotingDuration } from "../constants/Config";
import { roomState } from "../constants/Enums";

export const isRoomInIdeaSubmissionPhase = async (roomID: string) => {
  const room = await dbInstance.getRoom(roomID);

  if (
    room === null ||
    room.status !== roomState.ACTIVE ||
    room.startedAt === false
  )
    return false;

  return room.startedAt + SubmissionDuration > Date.now();
};

export const isRoomInIdeaVotingPhase = async (roomID: string) => {
  const room = await dbInstance.getRoom(roomID);

  if (
    room === null ||
    room.status !== roomState.ACTIVE ||
    room.startedAt === false
  )
    return false;

  const now = Date.now();

  return (
    now > room.startedAt + SubmissionDuration &&
    now < room.startedAt + SubmissionDuration + VotingDuration
  );
};

export const isRoomInWaitingPhase = async (roomID: string) => {
  const room = await dbInstance.getRoom(roomID);
  if (
    room === null ||
    room.status !== roomState.WAITING ||
    room.startedAt !== false
  )
    return false;

  return room.status === roomState.WAITING;
};

export const isRoomInVoteResultsPhase = async (roomID: string) => {
  const room = await dbInstance.getRoom(roomID);
  return room.status === roomState.CLOSED;
};

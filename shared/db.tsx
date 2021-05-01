import firebase from "firebase/app";
import { roomState } from "../constants/Enums";

const hmwsCollectionName = "HMWs";
const solutionsSubCollectionName = "Solutions";
const participantsSubCollectionName = "Participants";
const votesSubCollectionName = "Votes";
const maxVoteCount = 4;
const minParticipantsCount = 20;

const db = (
  firestore,
  collection = hmwsCollectionName,
  maxVotes = maxVoteCount,
  minParticipants = minParticipantsCount
) => ({
  votes: {},

  async createRoom(hmwText, problemStatement = "", isPrivate = false) {
    let roomRef = await firestore.collection(collection).add({
      question: hmwText,
      problemStatement: problemStatement,
      isPrivate: isPrivate,
      status: roomState.WAITING,
      startedAt: false,
    });
    await this.joinRoom(roomRef.id);
    return roomRef.id;
  },

  async joinRoom(roomID: string) {
    await firestore
      .collection(collection)
      .doc(roomID)
      .collection(participantsSubCollectionName)
      .add({});
  },

  async startRoom(roomID: string) {
    let participants = await this.getParticipants(roomID);
    if (participants.length >= minParticipantsCount) {
      await firestore
        .collection(collection)
        .doc(roomID)
        .set(
          {
            status: roomState.ACTIVE,
            startedAt: firebase.firestore.Timestamp.fromDate(new Date()),
          },
          { merge: true }
        );
      return true;
    } else {
      return false;
    }
  },

  async closeRoom(roomID: string) {
    await firestore.collection(collection).doc(roomID).set(
      {
        status: roomState.CLOSED,
      },
      { merge: true }
    );
    return true;
  },

  async createSolution(roomID: string, solutionText: string) {
    let solutionRef = await firestore
      .collection(collection)
      .doc(roomID)
      .collection(solutionsSubCollectionName)
      .add({
        text: solutionText,
      });
    return solutionRef.id;
  },

  async upvote(roomID: string, solutionID) {
    if (!(roomID in this.votes)) {
      this.votes[roomID] = 0;
    }

    if (this.votes[roomID] >= maxVotes) {
      // already voted max times
      return false;
    } else {
      await firestore
        .collection(collection)
        .doc(roomID)
        .collection(solutionsSubCollectionName)
        .doc(solutionID)
        .collection(votesSubCollectionName)
        .add({});
      this.votes[roomID] += 1;
      return true;
    }
  },

  async getRoom(roomID: string) {
    let room;
    try {
      room = await firestore.collection(collection).doc(roomID).get();
    } catch (e) {
      console.log(e);
      return null;
    }

    return room.exists ? room.data() : null;
  },

  async getParticipants(roomID: string) {
    let participants = await firestore
      .collection(collection)
      .doc(roomID)
      .collection(participantsSubCollectionName)
      .get();
    return participants.docs.map((s) => s.data());
  },

  async getSolutions(roomID: string) {
    let solutions = await firestore
      .collection(collection)
      .doc(roomID)
      .collection(solutionsSubCollectionName)
      .get();
    return solutions.docs.map((s) => s.data());
  },
});

export default db;

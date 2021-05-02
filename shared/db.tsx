import firebase from "firebase/app";
import { roomState } from "../constants/Enums";

const hmwsCollectionName = "HMWs";
const solutionsSubCollectionName = "Solutions";
const participantsSubCollectionName = "Participants";
const votesSubCollectionName = "Votes";
const maxVoteCount = 4;
const minParticipantsCount = 1; // TODO bring it to 20

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
    if (participants.length >= minParticipants) {
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
        votes: 0,
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
        .update("votes", firebase.firestore.FieldValue.increment(1));
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

    return room.exists ? this.buildRoom(room) : null;
  },

  buildRoom(room) {
    let data = room.data();
    data.id = room.id;
    return data;
  },

  watchRoom(roomID: string, callback) {
    firestore
      .collection(collection)
      .doc(roomID)
      .onSnapshot(
        (snapshot) => {
          callback(this.buildRoom(snapshot));
        },
        (error) => {
          callback(error);
        }
      );
  },

  watchRooms(callback, error) {
    firestore.collection(collection).onSnapshot(
      (snapshot) => {
        callback(snapshot.docs.map((s) => this.buildRoom(s)));
      },
      (error) => {
        error(error);
      }
    );
  },

  watchRoomParticipants(roomID: string, callback) {
    firestore
      .collection(collection)
      .doc(roomID)
      .collection(participantsSubCollectionName)
      .onSnapshot(
        (snapshot) => {
          callback(snapshot.docs.map((s) => s.data()));
        },
        (error) => {
          callback(error);
        }
      );
  },

  watchRoomSolutions(roomID: string, callback) {
    firestore
      .collection(collection)
      .doc(roomID)
      .collection(solutionsSubCollectionName)
      .onSnapshot(
        (snapshot) => {
          callback(snapshot.docs.map((s) => this.buildSolution(s)));
        },
        (error) => {
          console.log(error);
          callback(error);
        }
      );
  },

  buildSolution(solution, roomID) {
    let data = solution.data();
    data.id = solution.id;
    return data;
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

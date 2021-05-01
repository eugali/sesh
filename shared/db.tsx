import firebase from "firebase/app";

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
      status: "waiting",
      startedAt: false,
    });
    await this.joinRoom(roomRef.id);
    return roomRef.id;
  },

  async joinRoom(roomID) {
    await firestore
      .collection(collection)
      .doc(roomID)
      .collection(participantsSubCollectionName)
      .add({});
  },

  async startRoom(roomID) {
    let participants = await this.getParticipants(roomID);
    if (participants.length >= minParticipantsCount) {
      await firestore
        .collection(collection)
        .doc(roomID)
        .set(
          {
            status: "active",
            startedAt: firebase.firestore.Timestamp.fromDate(new Date()),
          },
          { merge: true }
        );
      return true;
    } else {
      return false;
    }
  },

  async closeRoom(roomID) {
    await firestore.collection(collection).doc(roomID).set(
      {
        status: "closed",
      },
      { merge: true }
    );
    return true;
  },

  async createSolution(roomID, solutionText) {
    let solutionRef = await firestore
      .collection(collection)
      .doc(roomID)
      .collection(solutionsSubCollectionName)
      .add({
        text: solutionText,
      });
    return solutionRef.id;
  },

  async upvote(roomID, solutionID) {
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

  async getRoom(roomID) {
    let room = await firestore.collection(collection).doc(roomID).get();
    return room.exists ? room.data() : null;
  },

  async getParticipants(roomID) {
    let participants = await firestore
      .collection(collection)
      .doc(roomID)
      .collection(participantsSubCollectionName)
      .get();
    return participants.docs.map((s) => s.data());
  },

  async getSolutions(roomID) {
    let solutions = await firestore
      .collection(collection)
      .doc(roomID)
      .collection(solutionsSubCollectionName)
      .get();
    return solutions.docs.map((s) => s.data());
  },
});

export default db;

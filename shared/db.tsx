import { max } from "react-native-reanimated";

const hmwsCollectionName = "HMWs";
const solutionsSubCollectionName = "Solutions";
const participantsSubCollectionName = "Participants";
const votesSubCollectionName = "Votes";
const maxVoteCount = 4;

const db = (
  firestore,
  collection = hmwsCollectionName,
  maxVotes = maxVoteCount
) => ({
  votes: {},

  async createRoom(hmwText) {
    let roomRef = await firestore.collection(collection).add({
      question: hmwText,
      isPrivate: false,
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
      let res = await firestore
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

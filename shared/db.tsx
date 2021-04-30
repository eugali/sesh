const hmwsCollectionName = "HMWs";
const solutionsCollectionName = "Solutions";
const participantsCollectionName = "Participants";

const db = (firestore, collection = hmwsCollectionName) => ({
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
      .collection(participantsCollectionName)
      .doc()
      .set({});
  },

  async createSolution(roomID, solutionText) {
    await firestore
      .collection(collection)
      .doc(roomID)
      .collection(solutionsCollectionName)
      .doc()
      .set({
        text: solutionText,
      });
  },

  async getRoom(roomID) {
    let room = await firestore.collection(collection).doc(roomID).get();
    return room.exists ? room.data() : null;
  },

  async getSolutions(roomID) {
    let solutions = await firestore
      .collection(collection)
      .doc(roomID)
      .collection(solutionsCollectionName)
      .get();
    return solutions.docs.map((s) => s.data());
  },
});

export default db;

import db from "../db";
import firebase from "firebase/app";
import { firebaseConfig } from "../../constants/Config";
import { roomState } from "../../constants/Enums";
import "firebase/firestore";

const testCollection = "HMWsTest";
const minParticipants = 20;
const maxVotes = 4;
let testFirestore;
let testDB;
let testRoomID;
let testSolutionID;

beforeAll(() => {
  firebase.initializeApp(firebaseConfig);
  testFirestore = firebase.firestore();
  testDB = db(testFirestore, testCollection, maxVotes, minParticipants);
});

test("Creates new room given valid HMW", async () => {
  testRoomID = await testDB.createRoom("How might we test the DB?");
  let room = await testDB.getRoom(testRoomID);
  expect(room).toStrictEqual({
    id: room.id,
    isPrivate: false,
    question: "How might we test the DB?",
    problemStatement: "",
    status: roomState.WAITING,
    startedAt: false,
  });
});

test("Creates new solution for HMW given valid solution", async () => {
  testSolutionID = await testDB.createSolution(testRoomID, "Very carefully");
  let solutions = await testDB.getSolutions(testRoomID);
  expect(solutions[0].text).toBe("Very carefully");
  expect(solutions.length).toBe(1);
});

test("Allows no more than 4 upvotes on one post in one room", async () => {
  for (let i = 0; i < maxVotes; i++) {
    expect(await testDB.upvote(testRoomID, testSolutionID)).toBe(true);
  }
  expect(await testDB.upvote(testRoomID, testSolutionID)).toBe(false);
});

test("Should forbid starting room with unsufficient participants", async () => {
  expect(await testDB.startRoom(testRoomID)).toBe(false);
});

test("Should allow starting room with sufficient participants", async () => {
  for (let i = 0; i < minParticipants; i++) {
    testDB.joinRoom(testRoomID);
  }
  expect(await testDB.startRoom(testRoomID)).toBe(true);
});

test("Should allow starting a room and notify listeners", async (done) => {
  first = true;
  testDB.watchRoom(testRoomID, (room) => {
    if (first) expect(room.status).toBe(roomState.ACTIVE);
    first = false;
    done();
  });
  testDB.startRoom(testRoomID);
});

test("Closes a room", async () => {
  expect(await testDB.closeRoom(testRoomID)).toBe(true);
});

test("Shows new solutions in real time", async (done) => {
  let first = true;
  let newRoomID = await testDB.createRoom("Test");
  let expectedNewSolution = "Asynchronously";
  await testDB.watchRoomSolutions(newRoomID, (solutions) => {
    if (first) {
      expect(solutions[0].text).toBe(expectedNewSolution);
      expect(solutions[0].votes).toBe(0);
      first = false;
    } else {
      expect(solutions[0].votes).toBe(1);
      done();
    }
  });
  let newID = await testDB.createSolution(newRoomID, expectedNewSolution);
  await testDB.upvote(newRoomID, newID);
}, 10000);

test("Shows new participants in real time", async (done) => {
  let newRoomID = await testDB.createRoom("Test");
  first = true;
  testDB.watchRoomParticipants(newRoomID, (participants) => {
    if (first) {
      expect(participants.length).toBe(1);
      first = false;
    } else {
      expect(participants.length).toBe(2);
      done();
    }
  });
  await testDB.joinRoom(newRoomID);
}, 1000);

test("Should allow leaving a room", async () => {
  let participants = await testDB.getParticipants(testRoomID);
  await testDB.leaveRoom(testRoomID);
  let participantsNew = await testDB.getParticipants(testRoomID);
  expect(participants.length - participantsNew.length).toBe(1);
});

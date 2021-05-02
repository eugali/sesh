import db from "../db";
import firebase from "firebase/app";
import { firebaseConfig } from "../../constants/Config";
import { roomState } from "../../constants/Enums";
import "firebase/firestore";

const testCollection = "HMWsTest";
let testFirestore;
let testDB;
let testRoomID;
let testSolutionID;

beforeAll(() => {
  firebase.initializeApp(firebaseConfig);
  testFirestore = firebase.firestore();
  testDB = db(testFirestore, testCollection);
});

test("Creates new room given valid HMW", async () => {
  testRoomID = await testDB.createRoom("How might we test the DB?");
  let room = await testDB.getRoom(testRoomID);
  expect(room).toStrictEqual({
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
  expect(solutions).toStrictEqual([{ text: "Very carefully" }]);
});

test("Allows no more than 4 upvotes on one post in one room", async () => {
  expect(await testDB.upvote(testRoomID, testSolutionID)).toBe(true);
  expect(await testDB.upvote(testRoomID, testSolutionID)).toBe(true);
  expect(await testDB.upvote(testRoomID, testSolutionID)).toBe(true);
  expect(await testDB.upvote(testRoomID, testSolutionID)).toBe(true);
  expect(await testDB.upvote(testRoomID, testSolutionID)).toBe(false);
});

test("Should forbid starting room with unsufficient participants", async () => {
  expect(await testDB.startRoom(testRoomID)).toBe(false);
});

test("Should allow starting room with sufficient participants", async () => {
  for (let i = 0; i < 20; i++) {
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
  let newRoomID = await testDB.createRoom("Test");
  let expectedNewSolution = "Asynchronously";
  testDB.watchRoomSolutions(newRoomID, (solutions) => {
    expect(solutions).toStrictEqual([{ text: expectedNewSolution }]);
    done();
  });
  await testDB.createSolution(newRoomID, expectedNewSolution);
}, 1000);

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

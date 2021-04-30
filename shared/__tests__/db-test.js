import db from "../db";
import firebase from "firebase/app";
import { firebaseConfig } from "../../constants/Config";
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
        status: "waiting",
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

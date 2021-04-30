import db from "../db";
import firebase from "firebase/app";
import { firebaseConfig } from "../../constants/Config";
import "firebase/firestore";

const testCollection = "HMWsTest";
let testFirestore;
let testDB;

beforeAll(() => {
    firebase.initializeApp(firebaseConfig);
    testFirestore = firebase.firestore();
    testDB = db(testFirestore, testCollection);
});

test("Creates new room given valid HMW", async () => {
    let roomID = await testDB.createRoom("How might we test the DB?");
    let room = await testDB.getRoom(roomID);
    expect(room).toStrictEqual({
        isPrivate: false,
        question: "How might we test the DB?",
        status: "waiting",
        startedAt: false,
    });
});

test("Creates new solution for HMW given valid solution", async () => {
    let roomID = await testDB.createRoom("How might we test the DB?");
    await testDB.createSolution(roomID, "Very carefully");
    let solutions = await testDB.getSolutions(roomID);
    expect(solutions).toStrictEqual([{ text: "Very carefully" }]);
});

import db from "./db";
import firebase from "firebase/app";
import "firebase/firestore";
import {
  firebaseConfig,
  prodCollectionName,
  MinParticipants,
  MaxVotes,
} from "../constants/Config";

firebase.initializeApp(firebaseConfig);
console.log("Firebase initialized");
const dbInstance = db(
  firebase.firestore(),
  prodCollectionName,
  MaxVotes,
  MinParticipants
);
console.log("Firebase instance created");

export default dbInstance;

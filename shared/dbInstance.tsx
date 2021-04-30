import db from "./db";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig } from "../constants/Config";

firebase.initializeApp(firebaseConfig);
const dbInstance = Object.freeze(db(firebase.firestore()));

export default dbInstance;

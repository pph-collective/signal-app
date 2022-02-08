// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore/lite";
import { parse } from "zipson";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPQ4bLraU1JOyHyJnOZR6vwpOMzFG-14c",
  authDomain: "signal-ri.firebaseapp.com",
  projectId: "signal-ri",
  storageBucket: "signal-ri.appspot.com",
  messagingSenderId: "677604573225",
  appId: "1:677604573225:web:3292361b3481fbdd7bdc38",
  measurementId: "G-Y4BWT9PHG2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// TODO: how to analytics with this?
// const analytics = getAnalytics(app);

const getDocWithDefault = async <T>(
  defaultValue: T,
  collection: string,
  ...queryPath: string[]
) => {
  const docRef = doc(db, collection, ...queryPath);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : defaultValue;
};

export const fetchColdSpotData = async (datasetName: string, date: string) => {
  const rawData = await getDocWithDefault({}, datasetName, date);

  const result = {};
  const promises = Object.keys(rawData).map(async (field) => {
    if (["stats", "geo"].includes(field)) {
      result[field] = parse(rawData[field]);
    } else {
      result[field] = rawData[field];
    }
  });
  await Promise.all(promises);

  return result;
};

export const fetchKeys = async (datasetName: string) => {
  const querySnapshot = await getDocs(collection(db, datasetName));
  return querySnapshot.docs
    .map((d) => d.id)
    .sort()
    .reverse();
};

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  enableIndexedDbPersistence,
  getDocFromCache,
  getDocFromServer,
  getDocs,
  DocumentSnapshot,
} from "firebase/firestore";
import { getAnalytics, logEvent } from "firebase/analytics";
import { parse } from "zipson";

// Your web app's Firebase configuration
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
const analytics = getAnalytics(app);

// Enable Firebase caching
enableIndexedDbPersistence(db).catch(() => {
  console.warn("unable to use cache");
});

const getDocWithDefaultPreferCache = async <T>(
  defaultValue: T,
  collection: string,
  ...queryPath: string[]
) => {
  const docRef = doc(db, collection, ...queryPath);
  let docSnap: DocumentSnapshot;
  try {
    docSnap = await getDocFromCache(docRef);
  } catch (e) {
    docSnap = await getDocFromServer(docRef);
  }

  return docSnap.exists() ? docSnap.data() : defaultValue;
};

export const fetchColdSpotData = async (datasetName: string, date: string) => {
  const result = { geo: [], stats: [] };
  const rawData = await getDocWithDefaultPreferCache(result, datasetName, date);

  Object.entries(rawData).forEach(([field, value]) => {
    if (["stats", "geo"].includes(field)) {
      result[field] = parse(value as string);
    } else {
      result[field] = value;
    }
  });

  return result;
};

export const fetchKeys = async (datasetName: string) => {
  const querySnapshot = await getDocs(collection(db, datasetName));
  return querySnapshot.docs
    .map((d) => d.id)
    .sort()
    .reverse();
};

// log a pre-defined or custom event (e.g. content interaction) to firebase analytics
// https://firebase.google.com/docs/analytics/events?platform=web
export const logAnalytics = (event: string, params: object) =>
  logEvent(analytics, event, params);

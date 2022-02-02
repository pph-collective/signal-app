// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import axios from "axios";

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
const storage = getStorage(app);

// TODO: how to analytics with this?
// const analytics = getAnalytics(app);

export const fetchColdSpotData = async (datasetName: string, date: string) => {
  try {
    const querySnapshot = await listAll(ref(storage, `${datasetName}/${date}`));

    const result = {};

    for (const itemRef of querySnapshot.items) {
      const url = await getDownloadURL(itemRef);
      const field = itemRef.name.split(".")[0];
      result[field] = await axios.get(url);
    }

    return result;
  } catch (error) {
    import.meta.env.DEV && console.error(error);
    throw new Error("Unable to get data, try again later! :(");
  }
};

export const fetchKeys = async (datasetName: string) => {
  const querySnapshot = await listAll(ref(storage, datasetName));
  return querySnapshot.prefixes.map((p) => p.name).sort();
};

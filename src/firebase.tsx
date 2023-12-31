import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  serverTimestamp,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;

const db = getFirestore(app);
export const database = {
  folders: collection(db, "folders"),
  files: collection(db, "files"),
  formatDoc: (doc: QueryDocumentSnapshot) => {
    const newDoc = {
      name: doc.data().name,
      id: doc.id,
      parentID: doc.data().parentID,
      userID: doc.data().userID,
      createdAt: doc.data().createdAt,
      path: doc.data().path,
    };
    // console.log("newDoc: ", newDoc)
    return newDoc;
  },
  getCurrentTimestamp: serverTimestamp,
};

export const storage = getStorage(app);

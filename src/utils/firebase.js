import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

const firestore = firebase.firestore();

export const fireFunctions = {
  async addGroup(charactersGroup, groupName) {
    const groupRef = firestore.collection("groups");

    groupRef.add({ membres: charactersGroup, nom: groupName });
  },

  async getGroups() {
    const groupRef = firestore.collection("groups");
    const docs = await groupRef.get();
    docs.forEach((doc) => console.log(typeof doc, "=>", doc.data()));
  },
};

export const auth = app.auth();
export const persistence = {
  session: firebase.auth.Auth.Persistence.SESSION,
  local: firebase.auth.Auth.Persistence.LOCAL,
};
export default app;

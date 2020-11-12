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

// ensemble des fonctions utilisées pour firestore
export const fireFunctions = {
  // ajout d'un groupe
  async addGroup(charactersGroup, groupName) {
    const groupsRef = firestore.collection("groups");

    groupsRef.add({ membres: charactersGroup, nom: groupName });
  },

  // récupération des groupes
  async getGroups() {
    const groupsRef = firestore.collection("groups");
    const docs = await groupsRef.get();
    docs.forEach((doc) => console.log(typeof doc, "=>", doc.data()));
  },

  // ajout d'un nouveau membre
  async addMemberAlts(mainCharacterId, characters) {
    const membersRef = firestore.collection("members");

    membersRef.add({ main: Number(mainCharacterId), characters: characters });
  },

  // récupération des inforamtion d'un membre selon l'id d'un de ses personnages
  async getMemberAltsById(characterId) {
    const membersRef = firestore.collection("members");
    const docs = await membersRef.get();

    let member = {};
    docs.forEach((doc) => {
      const foundMember = doc
        .data()
        .characters.find((character) => character.id === characterId);
      if (foundMember) {
        member = { docId: doc.id, data: doc.data() };
      }
    });

    return member;
  },

  // mise à jours dés infos d'un membre existant
  async updateMemberAlts(docId, mainCharacterId, characters) {
    const memberRef = firestore.doc(`members/${docId}`);
    await memberRef.set({
      main: Number(mainCharacterId),
      characters: characters,
    });
  },

  async deleteMemberAlts(docId) {
    const memberRef = firestore.doc(`members/${docId}`);
    await memberRef.delete();
  },
};

export const auth = app.auth();
export const persistence = {
  session: firebase.auth.Auth.Persistence.SESSION,
  local: firebase.auth.Auth.Persistence.LOCAL,
};
export default app;

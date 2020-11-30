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

export const roles = ["unknown", "Visiteur", "Membre", "Admin"];

const firestore = firebase.firestore();

// définition des références aux différentes collections
const usersRef = firestore.collection("users");
const groupsRef = firestore.collection("groups");
const membersRef = firestore.collection("members");

// ensemble des fonctions utilisées pour les utilisateurs
export const fireUsersFunctions = {
  async createUserAccount({ uid, email }) {
    const defaultUserData = {
      role: 1,
      mainCharacter: "",
      email: email,
      isActive: true,
    };

    await usersRef.doc(uid).set(defaultUserData);
  },

  async getUserAccount(userUid) {
    const doc = await usersRef.doc(userUid).get();
    return doc.data();
  },

  async updateUserAccount(userUid, role, mainCharacter) {
    await usersRef.doc(userUid).set({ role, mainCharacter });
  },

  async deleteUserAccount(userUid) {
    const user = await usersRef.doc(userUid);
    await user.delete();
  },
};

// ensemble des fonctions utilisées pour les groupes
export const fireGroupsFunctions = {
  // ajout d'un groupe
  async addGroup(charactersGroup, groupName) {
    const result = await groupsRef.add({
      characters: charactersGroup,
      name: groupName,
    });
    return result?.id;
  },

  // récupération des groupes
  async getGroups() {
    const groups = await groupsRef.get();
    let groupsData = [];

    groups.forEach((group) => {
      groupsData = [{ ...group.data(), id: group.id }, ...groupsData];
    });

    return groupsData;
  },

  async getGroupById(groupId) {
    const group = await groupsRef.doc(groupId).get();
    return group.data();
  },

  async updateGroup(charactersGroup, groupName, groupId) {
    await groupsRef.doc(groupId).set({
      characters: charactersGroup,
      name: groupName,
    });
  },

  // suppression d'un groupe
  async deleteGroup(groupId) {
    const groupRef = await groupsRef.doc(groupId);
    await groupRef.delete();
  },
};

// ensemble des fonctions utilisées pour les alts
export const fireAltsFunctions = {
  // ajout d'un nouveau membre
  async addMemberAlts(mainCharacterId, characters) {
    membersRef.add({ main: Number(mainCharacterId), characters: characters });
  },

  async getAllMembers() {
    const members = await membersRef.get();

    const membersData = [];
    members.forEach((member) =>
      membersData.push({ docId: member.id, altsData: member.data() })
    );

    return membersData;
  },

  // mise à jours dés infos d'un membre existant
  async updateMemberAlts(docId, mainCharacterId, characters) {
    const memberRef = membersRef.doc(docId);
    await memberRef.set({
      main: Number(mainCharacterId),
      characters: characters,
    });
  },

  async deleteMemberAlts(docId) {
    const memberRef = membersRef.doc(docId);
    await memberRef.delete();
  },
};

export const auth = app.auth();
export const persistence = {
  session: firebase.auth.Auth.Persistence.SESSION,
  local: firebase.auth.Auth.Persistence.LOCAL,
};
export default app;

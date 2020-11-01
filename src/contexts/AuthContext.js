import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, persistence } from "../utils/firebase";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  const signup = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
  };

  const login = async (email, password, remember) => {
    if (!remember) {
      auth.setPersistence(persistence.session);
    } else {
      auth.setPersistence(persistence.local);
    }
    return auth.signInWithEmailAndPassword(email, password);
  };

  const logout = () => {
    return auth.signOut();
  };

  const resetPassword = (email) => {
    auth.useDeviceLanguage();
    return auth.sendPasswordResetEmail(email);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = { currentUser, signup, login, logout, resetPassword };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

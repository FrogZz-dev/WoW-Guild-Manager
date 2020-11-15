import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, persistence, fireUsersFunctions } from "@utils/firebase";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // initialise la langue, utile pour les mails envoyés aux utilisateurs
  auth.useDeviceLanguage();

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
    return auth.sendPasswordResetEmail(email);
  };

  const deleteAccount = async () => {
    await currentUser.delete();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);

      if (user) {
        const userData = await fireUsersFunctions.getUserAccount(user.uid);
        if (userData) {
          setUserInfo(userData);
        }

        if (!user.displayName) {
          user.updateProfile({
            displayName: user.email.split("@")[0],
          });
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userInfo,
    setUserInfo,
    signup,
    login,
    logout,
    resetPassword,
    deleteAccount,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

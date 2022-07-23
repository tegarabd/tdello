import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import React, { useState, createContext, useContext, useEffect } from "react";
import { auth } from "../firebase/config";
import { addNewUser } from "../firebase/firestore/userRepository";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      setUser(user);
    });
  }, []);

  const register = async (name, email, password, callback) => {
    return createUserWithEmailAndPassword(auth, email, password).then(
      async ({ user }) => {
        await updateProfile(user, { displayName: name });
        setUser(user);
        callback(user);
        await addNewUser(user.uid, name, email)
      }
    );
  };

  const signin = async (email, password, callback) => {
    return signInWithEmailAndPassword(auth, email, password).then(
      ({ user }) => {
        setUser(user);
        callback();
      }
    );
  };

  const signout = async callback => {
    return signOut(auth).then(() => {
      setUser(null);
      callback();
    });
  };

  let value = { user, register, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

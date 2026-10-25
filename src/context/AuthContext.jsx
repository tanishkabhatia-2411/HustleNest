import React, { createContext, useState, useCallback } from 'react';
import {
  getStoredUser,
  saveStoredUser,
  getUserCV,
  getUserId,
} from '../utils/storage';

// 1. Create the Context object
//    This is what components will import and use with useContext()
export const AuthContext = createContext(null);

// 2. Create the Provider component
//    This wraps the app and supplies the shared state to all children
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [savedCV, setSavedCV] = useState(() => {
    const storedUser = getStoredUser();
    return storedUser?.isLogged ? getUserCV(getUserId(storedUser)) : null;
  });

  // Login: save user to localStorage and update state
  const login = useCallback((userData) => {
    const userWithId = userData.id ? userData : { ...userData, id: getUserId(userData) };
    saveStoredUser(userWithId);
    setUser(userWithId);
    const uid = getUserId(userWithId);
    setSavedCV(getUserCV(uid));
  }, []);

  // Logout: reset to guest state
  const logout = useCallback(() => {
    const guestUser = { isLogged: false, role: 'student', name: '', email: '' };
    saveStoredUser(guestUser);
    setUser(guestUser);
    setSavedCV(null);
  }, []);

  // Update savedCV (after CV is saved or deleted)
  const refreshCV = useCallback((userId) => {
    if (userId) {
      setSavedCV(getUserCV(userId));
    } else {
      setSavedCV(null);
    }
  }, []);

  // Computed helpers
  const isLogged = user?.isLogged === true;
  const isRecruiter = isLogged && user.role === 'recruiter';
  const userId = getUserId(user);

  // The value object is what all consumers receive from useContext(AuthContext)
  const value = {
    user,
    savedCV,
    isLogged,
    isRecruiter,
    userId,
    login,
    logout,
    refreshCV,
    setUser,
    setSavedCV,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

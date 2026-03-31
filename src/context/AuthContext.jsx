import { useState } from "react";
import { AuthContext } from "./auth-context";

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);

  const login = (email) => {
    const dummyUser = { email: email.trim().toLowerCase() };
    setUser(dummyUser);
    localStorage.setItem("user", JSON.stringify(dummyUser));
    return dummyUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: Boolean(user) }}
    >
      {children}
    </AuthContext.Provider>
  );
};

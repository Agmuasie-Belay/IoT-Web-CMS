import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getMe } from "../services/api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing authentication when the CMS starts
  useEffect(() => {
    const token = localStorage.getItem("cms_token");

    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((result) => {
        const authenticatedUser =
          result?.user ??
          result?.data?.user ??
          result?.data ??
          result;

        setUser(authenticatedUser);
      })
      .catch(() => {
        localStorage.removeItem("cms_token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Called after successful login
  const loginUser = (token, authenticatedUser) => {
    localStorage.setItem("cms_token", token);
    setUser(authenticatedUser);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("cms_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        loginUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
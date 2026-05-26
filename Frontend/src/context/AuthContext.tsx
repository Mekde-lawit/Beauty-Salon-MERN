import React, { createContext, useState, useEffect, useContext } from "react";
import { LoginAccount } from "../types";

interface AuthContextProps {
  isAuthenticated: boolean;
  loginData: LoginAccount | null;
  setLoginData: (token: LoginAccount | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loginData, setLoginData] = useState<LoginAccount | null>(null);

  useEffect(() => {
    const storedToken = JSON.parse(sessionStorage.getItem("authToken") || "{}");
    setLoginData(storedToken);
  }, []);

  const logout = () => {
    sessionStorage.removeItem("authToken");
    setLoginData(null);
  };

  const value = {
    isAuthenticated: loginData?.token ? true : false,
    loginData,
    setLoginData,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

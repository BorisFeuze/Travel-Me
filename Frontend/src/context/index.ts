import { createContext, use } from "react";
import AuthProvider from "./AuthProvider";
import UserProvider from "./UserProvider";

const AuthContext = createContext<AuthContextType | null>(null);

const useAuth = (): AuthContextType => {
  const context = use(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

const UserContext = createContext<UserContextType | null>(null);

const useUser = (): UserContextType => {
  const context = use(UserContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export {
  AuthContext,
  AuthProvider,
  useAuth,
  UserContext,
  useUser,
  UserProvider,
};

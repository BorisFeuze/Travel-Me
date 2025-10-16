import { useState, useEffect, type ReactNode } from "react";
import { toast } from "react-toastify";
import { AuthContext } from ".";
import { me, login, logout, register, createUserCard } from "@/data";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Track authentication state
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [checkSession, setCheckSession] = useState(true);

  // console.log(user);

  // Handle sign-in: save token and update state
  const handleSignIn = async ({ email, password }: LoginData) => {
    await login({ email, password });
    setCheckSession(true); // Trigger session check
    setSignedIn(true);
  };

  // Handle sign-out: clear token and reset state
  const handleSignOut = async () => {
    await logout();
    setSignedIn(false);
    setUser(null);
  };

  const handleRegister = async ({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  }: RegisterData) => {
    await register({ firstName, lastName, email, password, confirmPassword });
    setCheckSession(true);
    setSignedIn(true);
  };

  // On mount (or when checkSession changes), verify if user is logged in
  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await me(); // Get user profile from API
        setUser(data.user);
        // console.log(data.user);
        // console.log(data.user?._id);
        await createUserCard({ userId: user?._id });
        setSignedIn(true);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Something went wrong ";
        toast.error(errorMessage);
      } finally {
        setCheckSession(false); // Stop checking session after attempt
      }
    };

    if (checkSession) getUser();
  }, [checkSession]);

  return (
    <AuthorizContext
      value={{
        checkSession,
        signedIn,
        user,
        handleSignIn,
        handleSignOut,
        handleRegister,
      }}
    >
      {children}
    </AuthorizContext>
  );
};

export default AuthProvider;

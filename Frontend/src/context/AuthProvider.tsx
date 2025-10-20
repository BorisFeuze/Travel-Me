import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from '.';
import { login, me, logout, register, addUserDetails } from '@/data';

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [signedIn, setSignedIn] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [checkSession, setCheckSession] = useState(true);

	const handleSignIn = async ({ email, password }: LoginData) => {
		await login({ email, password });
		setSignedIn(true);
		setCheckSession(true);
	};

	const handleRegister = async (formState: RegisterData) => {
		await register(formState);
		setSignedIn(true);
		setCheckSession(true);
	};

	const handleSignOut = async () => {
		await logout();
		setSignedIn(false);
		setUser(null);
	};

	useEffect(() => {
  const getUser = async () => {
    try {
      const userData = await me();
      console.log("Data", userData);
      
      setUser(userData.user); 
      setSignedIn(true);
      
      const detailUser = await addUserDetails({ userId: userData.user._id });
      console.log(detailUser);
    } catch (error) {
      console.error(error);
    } finally {
      setCheckSession(false);
    }
  };

  if (checkSession) getUser();
}, [checkSession]);


	const value: AuthContextType = {
		signedIn,
		user,
		handleSignOut,
		handleSignIn,
		handleRegister
	};

	return <AuthContext value={value}>{children}</AuthContext>;
};

export default AuthProvider;
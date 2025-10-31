import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from ".";
import { VITE_APP_USER_API_URL } from "@/config";
import { io } from "socket.io-client";
import { login, me, logout, register /* updateUser */ } from "@/data";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [checkSession, setCheckSession] = useState(true);

  const handleSignIn = async ({ email, password }: LoginData) => {
    await login({ email, password });
    setSignedIn(true);
    setCheckSession(true);
  };

  const handleRegister = async (formState: Omit<RegisterData, "_id">) => {
    await register(formState);
    // setSignedIn(true);
    setCheckSession(true);
  };

  const handleSignOut = async () => {
    await logout();
    setSignedIn(false);
    socket?.disconnect();
    setUser(null);
  };

  // const handleUpdateUser = async (id, body) => {
  //   const { data } = await updateUser(id, body);
  //   if (data) {
  //     setUser(data.user);
  //   }
  // };

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await me();
        // console.log("Data", userData);

        setUser(userData.user);
        setSignedIn(true);
        connectSocket(socket!, userData.user);
      } catch (error) {
        console.error(error);
      } finally {
        setCheckSession(false);
      }
    };

    if (checkSession) getUser();
  }, [checkSession]);

  //connect socket function to handle socket connection and online updates
  const connectSocket = (socket: Socket, userData: User) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(VITE_APP_USER_API_URL, {
      query: {
        userId: userData._id,
      },
    });
    // console.log(newSocket);
    newSocket.connect();
    setSocket(newSocket as unknown as Socket);
    newSocket.on("getOnlineUser", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  // console.log(onlineUsers);

  const value: AuthContextType = {
    signedIn,
    user,
    handleSignOut,
    handleSignIn,
    handleRegister,
    checkSession,
    setCheckSession,
    onlineUsers,
    socket,
    // handleUpdateUser,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
};

export default AuthProvider;

import { useEffect, useState, type ReactNode } from "react";
import { UserContext } from ".";
import { getAllUserProfiles } from "@/data";
import { useAuth } from ".";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [allUsers, setAllUsers] = useState([]);
  const { checkSession, setCheckSession } = useAuth();

  useEffect(() => {
    const getAllUser = async () => {
      try {
        const usersData = await getAllUserProfiles();
        console.log("Data", usersData.userProfiles);

        setAllUsers(usersData.userProfiles);
      } catch (error) {
        console.error(error);
      } finally {
        setCheckSession(false);
      }
    };
    if (checkSession) getAllUser();
  }, [checkSession]);

  console.log(allUsers);

  const value: UserContextType = {
    allUsers,
    setAllUsers,
  };

  return <UserContext value={value}>{children}</UserContext>;
};

export default AuthProvider;

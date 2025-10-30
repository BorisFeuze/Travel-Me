import { useEffect, useState, type ReactNode } from "react";
import { UserContext } from ".";
import { getAllUserProfiles, getUserDetails } from "@/data";
import { useAuth } from ".";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [allUsers, setAllUsers] = useState<UserProfileData[]>([]);
  const { checkSession, setCheckSession } = useAuth();

  const getUserProfile = async (id: string) => {
    const userProfile = await getUserDetails(id);

    return userProfile;
  };

  useEffect(() => {
    const getAllUser = async () => {
      try {
        const usersData = await getAllUserProfiles();
        // console.log("Data", usersData.userProfiles);

        setAllUsers(usersData.userProfiles);
      } catch (error) {
        console.error(error);
      } finally {
        setCheckSession(false);
      }
    };
    if (checkSession) getAllUser();
  }, [checkSession]);

  const value: UserContextType = {
    allUsers,
    getUserProfile,
  };

  return <UserContext value={value}>{children}</UserContext>;
};

export default AuthProvider;

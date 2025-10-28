import avatar_icon from "../../assets/images/Chat/avatar_icon.png";
import { useState, useEffect } from "react";

import { getUserDetails } from "@/data";
import { useAuth, useChat } from "@/context";

const UserChat = ({ id, firstName, index, lastName }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState({});

  const { onlineUsers } = useAuth();

  const { unseenMessages } = useChat();

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserDetails(id);

        const userInfo = data?.userProfiles[0];

        if (userInfo) {
          setInfo(userInfo);
        }
      } catch {
        setError("Error fetching userProfile of Host");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <img
        src={info?.pictureURL || avatar_icon}
        alt=""
        className="w-[35px] aspect-square rounded-full"
      />
      <div className="flex flex-col leading-5">
        <p className="text-black">
          {firstName} {lastName}
        </p>
        {onlineUsers.includes(id) ? (
          <span className="text-green-400">Online</span>
        ) : (
          <span className="text-neutral-400 text-xs">Offline</span>
        )}
      </div>
      {/* {unseenMessages.id > 0 && (
        <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
          {unseenMessages.id}
        </p>
      )} */}
    </>
  );
};

export default UserChat;

import { ChatContainer, RightSidebar, Sidebar } from "@/components/UI";
import { useState, useEffect } from "react";
import {
  getChatUsers,
  getMessages,
  sendMessages,
  updateNewMessages,
} from "@/data";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState<boolean>(false);
  const [users, setUsers] = useState([]);
  const [unseenMessages, setUnseenMessages] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const data = await getChatUsers();
        console.log("Data", data);
        if (data) {
          setUsers(data.users);
          setUnseenMessages(data.unseenMessages);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  console.log(users);

  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative ${selectedUser ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]" : "md:grid-cols-2"}`}
      >
        <Sidebar users={users} unseenMessages={unseenMessages} />
        <ChatContainer
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <RightSidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>
    </div>
  );
};
export default Chat;

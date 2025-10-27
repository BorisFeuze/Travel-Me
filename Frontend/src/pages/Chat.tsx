import { ChatContainer, RightSidebar, Sidebar } from "@/components/UI";
import { useState, useEffect } from "react";
import {
  getChatUsers,
  getMessages,
  sendMessages,
  updateNewMessages,
} from "@/data";
import { useAuth } from "@/context";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unseenMessages, setUnseenMessages] = useState({});
  const { user, onlineUsers } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const data = await getChatUsers();
        console.log("Data", data);
        if (data) {
          setChatUsers(data.users);
          setUnseenMessages(data.unseenMessages);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [onlineUsers]);

  useEffect(() => {
    async () => {
      try {
        const data = await getMessages(selectedUser?._id);
        console.log("Data", data);
        if (data) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error(error);
      }
    };
  }, [selectedUser]);

  const sendMessage = async (selectedUserId, messages) => {
    try {
      const data = await sendMessages(selectedUserId, messages);
      console.log("Data", data);
      if (data) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative ${selectedUser ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]" : "md:grid-cols-2"}`}
      >
        <Sidebar
          users={chatUsers}
          unseenMessages={unseenMessages}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <ChatContainer
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          messages={messages}
          setMessages={setMessages}
          sendMessage={sendMessage}
          onlineUsers={onlineUsers}
          user={user}
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

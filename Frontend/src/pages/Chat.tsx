import { ChatContainer, Sidebar } from "@/components/UI";
import { useState, useEffect } from "react";
import {
  getChatUsers,
  getMessages,
  sendMessages,
  /* updateNewMessages,*/
} from "@/data";
import { useAuth } from "@/context";
import type { User, Chat } from "@/types";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [chatUsers, setChatUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Chat[]>([]);
  const [unseenMessages, setUnseenMessages] = useState({});
  const { /*socket,*/ user, onlineUsers } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const data = await getChatUsers();
        // console.log("Data", data);
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
    (async () => {
      try {
        const data = await getMessages(selectedUser?._id);
        console.log("Data", data);
        if (data) {
          setMessages(data.chats);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [messages]);

  const sendMessage = async (selectedUserId: string, message: string) => {
    try {
      const data = await sendMessages(selectedUserId, message);
      console.log("Data", data);
      if (data) {
        setMessages((prev) => [...prev, data]);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const subscribeToMessages = () => {
  //   if (!socket) return;
  //   socket.on("newMessage", () => {
  //     if (selectedUser && newMessage.senderId === selectedUser._id) {
  //       newMessage.seen = true;
  //       setMessages((prevMessages) => [...prevMessages, newMessage]);
  //       updateNewMessages(newMessages._id);
  //     } else {
  //       setUnseenMessages((prev) => ({
  //         ...prev,
  //         [newMessages.senderId]: prev[newMessage.senderId]
  //           ? prev[newMessage.senderId] + 1
  //           : 1,
  //       }));
  //     }
  //   });
  // };

  // // function to unsubscribe from messages
  // const unsubscribeFromMessages = () => {
  //   if (socket) socket.off("newMessage");
  // };

  // useEffect(() => {
  //   subscribeToMessages();
  //   return () => unsubscribeFromMessages();
  // }, [socket, selectedUser]);

  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative ${selectedUser ? "md:grid-cols-[1fr_1.5fr] xl:grid-cols-[1fr_2fr]" : "md:grid-cols-2"}`}
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
          sendMessage={sendMessage}
          onlineUsers={onlineUsers}
          user={user}
        />
      </div>
    </div>
  );
};
export default Chat;

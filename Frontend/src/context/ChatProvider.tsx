import { useEffect, useState, type ReactNode } from "react";
import { ChatContext, useAuth } from ".";
import {
  getChatUsers,
  getMessages,
  sendMessages,
  updateNewMessages,
} from "@/data";

const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, user, onlineUsers } = useAuth();

  const handleGetusers = async () => {
    try {
      const data = await getChatUsers();
      console.log("Data", data);
      if (data) {
        setUsers(data.user);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetMessages = async () => {
    try {
      const data = await getMessages(user?._id);
      console.log("Data", data);
      if (data) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async () => {
    try {
      const data = await sendMessages(selectedUser?._id, messages);
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

  //function to subcribe to messages fot selected user

  const subscribeToMessages = () => {
    if (!socket) return;
    socket.on("newMessage", () => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        updateNewMessages(newMessages._id);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessages.senderId]: prev[newMessage.senderId]
            ? prev[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  // function to unsubscribe from messages
  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);
  const value: ChatContextType = {
    messages,
    users,
    selectedUser,
    handleGetusers,
    handleSendMessage,
    setMessages,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  };

  return <ChatContext value={value}>{children}</ChatContext>;
};

export default ChatProvider;

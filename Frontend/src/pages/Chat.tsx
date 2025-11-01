import { ChatContainer, Sidebar } from "@/components/UI";
import { useState, useEffect } from "react";
import {
  getChatUsers,
  getMessages,
  sendMessages,
  /* updateNewMessages,*/
} from "@/data";
import { useAuth } from "@/context";
import type { User, ChatType } from "@/types";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [chatUsers, setChatUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<ChatType[]>([]);
  const [, setUnseenMessages] = useState({});
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
        const data = await getMessages(selectedUser?._id as string);
        // console.log("Data", data);
        if (data) {
          setMessages(data.chats);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [messages]);

  const sendMessage = async (
    selectedUserId: string,
    messageData: ChatInputType
  ) => {
    try {
      const data = await sendMessages(selectedUserId, messageData);
      // console.log("Data", data);
      if (data) {
        setMessages((prev) => [...prev, data]);
      } else {
        console.error(data);
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
    <div className="w-full min-h-dvh overflow-x-hidden px-4 py-4 md:px-8 md:py-8">
      <div
        className={`mx-auto max-w-[1440px] h-[calc(100dvh-2rem)] md:h-[calc(100dvh-4rem)]
                    grid grid-cols-1 md:grid-cols-[340px_minmax(0,1fr)] md:gap-x-8 xl:gap-x-12
                    rounded-3xl border border-gray-200 bg-white shadow-md overflow-hidden`}
      >
        <Sidebar
          users={chatUsers}
          selectedUser={selectedUser!}
          setSelectedUser={setSelectedUser}
        />

        <div className="relative h-full">
          <div className="absolute inset-0">
            <ChatContainer
              selectedUser={selectedUser!}
              setSelectedUser={setSelectedUser}
              messages={messages}
              sendMessage={sendMessage}
              onlineUsers={onlineUsers}
              user={user!}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chat;

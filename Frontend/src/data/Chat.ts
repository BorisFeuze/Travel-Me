import { VITE_APP_USER_API_URL } from "@/config";

const baseURL: string = `${VITE_APP_USER_API_URL}/chats`;

export const getChatUsers = async () => {
  const res = await fetch(`${baseURL}`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Failed to get tne users");
  const data = await res.json();
  // console.log(data);
  return data;
};

export const getMessages = async (id) => {
  const res = await fetch(`${baseURL}/${id}`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Failed to get the Messages");
  const data = await res.json();
  // console.log(data);
  return data;
};

export const sendMessages = async (selectedUserId, messageData) => {
  const res = await fetch(`${baseURL}/send/${selectedUserId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageData),
  });
  if (!res.ok) throw new Error("Failed to send the Message");
  const data = await res.json();
  // console.log(data);
  return data;
};

export const updateNewMessages = async (newMessageId) => {
  const res = await fetch(`${baseURL}/mark/${newMessageId}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to send the Message");
  const data = await res.json();
  // console.log(data);
  return data;
};

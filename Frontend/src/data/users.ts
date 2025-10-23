import { VITE_APP_USER_API_URL } from "@/config";

const baseURL: string = `${VITE_APP_USER_API_URL}/users`;

export const getUsers = async () => {
  const res = await fetch(baseURL, {
    method: "GET",
  });

  if (!res.ok) throw new Error("Failed to save host details");
  const data = await res.json();
  console.log(data);
  return data;
};

import { VITE_APP_USER_API_URL } from "@/config";

const baseURL: string = `${VITE_APP_USER_API_URL}/users`;

export const getUsers = async () => {
  const res = await fetch(baseURL, {
    method: "GET",
  });

  if (!res.ok) throw new Error("Failed to save host details");
  const data = await res.json();
  // console.log(data);
  return data;
};

export const getSingleUser = async (id: string) => {
  const res = await fetch(`${baseURL}/${id}`, {
    method: "GET",
  });

  if (!res.ok) throw new Error("Failed to save host details");
  const data = await res.json();
  // console.log(data);
  return data;
};

export const updateUser = async (id: string, formData) => {
  const res = await fetch(`${baseURL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) throw new Error("Failed to save host details");
  const data = await res.json();
  console.log(data);
  return data;
};

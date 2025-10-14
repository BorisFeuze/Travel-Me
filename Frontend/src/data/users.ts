import { VITE_APP_USER_API_URL } from "@/config";

const baseURL: string = `${VITE_APP_USER_API_URL}/users`;

export const getUsers = async (): Promise<User[]> => {
  const res = await fetch(baseURL, {
    credentials: "include",
  });
  if (!res.ok) {
    const errorData = await res.json();
    if (!errorData.error) {
      throw new Error("An error occurred while fetching the posts");
    }
    throw new Error(errorData.error);
  }
  const data: User[] = await res.json();
  // console.log(data);
  return data;
};

export const creatUser = async (formData: Omit<User, "_id">): Promise<User> => {
  const res = await fetch(baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
    credentials: "include",
  });
  if (!res.ok) {
    const errorData = await res.json();
    if (!errorData.error) {
      throw new Error("An error occurred while creating the post");
    }
    throw new Error(errorData.error);
  }
  const data: User = await res.json();
  return data;
};

export const getSingleUser = async (id: string): Promise<User> => {
  const res = await fetch(`${baseURL}/${id}`, {
    credentials: "include",
  });
  if (!res.ok) {
    const errorData = await res.json();
    if (!errorData.error) {
      throw new Error("An error occurred while fetching the post");
    }
    throw new Error(errorData.error);
  }
  const data: User = await res.json();
  return data;
};

export const updateUser = async (
  id: string,
  formData: Omit<User, "_id">
): Promise<User> => {
  const res = await fetch(`${baseURL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
    credentials: "include",
  });
  if (!res.ok) {
    const errorData = await res.json();
    if (!errorData.error) {
      throw new Error("An error occurred while creating the post");
    }
    throw new Error(errorData.error);
  }
  const data: User = await res.json();
  return data;
};

export const deleteUser = async (id: string): Promise<SuccessRes> => {
  const res = await fetch(`${baseURL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const errorData = await res.json();
    if (!errorData.error) {
      throw new Error("An error occurred while creating the post");
    }
    throw new Error(errorData.error);
  }
  const data = (await res.json()) as { message: string };
  return data;
};

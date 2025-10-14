import { VITE_APP_USER_API_URL } from "@/config";

const baseURL: string = `${VITE_APP_USER_API_URL}/usercards`;

export const getAllUserCards = async (): Promise<UserCard[]> => {
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
  const data: UserCard[] = await res.json();
  // console.log(data);
  return data;
};

export const getUserCardbyQuery = async (
  userId: string
): Promise<UserCard[]> => {
  const res = await fetch(`${baseURL}?userId=${userId}`, {
    credentials: "include",
  });
  if (!res.ok) {
    const errorData = await res.json();
    if (!errorData.error) {
      throw new Error("An error occurred while fetching the posts");
    }
    throw new Error(errorData.error);
  }
  const data: UserCard[] = await res.json();
  // console.log(data);
  return data;
};

export const createUserCard = async (
  formData: Omit<UserCard, "_id">
): Promise<UserCard> => {
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
  const data: UserCard = await res.json();
  return data;
};

export const getSingleUserCard = async (id: string): Promise<UserCard> => {
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
  const data: UserCard = await res.json();
  return data;
};

export const updateUserCard = async (
  id: string,
  formData: Pick<UserCard, "points" | "score" | "pokemonId" | "userId">
): Promise<UserCard> => {
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
  const data: UserCard = await res.json();
  return data;
};

export const deleteUserCard = async (id: string): Promise<SuccessRes> => {
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

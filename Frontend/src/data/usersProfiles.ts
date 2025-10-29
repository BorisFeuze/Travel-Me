import { VITE_APP_USER_API_URL } from "@/config";

const baseURL: string = `${VITE_APP_USER_API_URL}/userProfiles`;

type UserProfilesResponse = {
  message: string;
  userProfiles: UserProfileData[];
};

export const addUserDetails = async (formData: FormData) => {
  const res = await fetch(baseURL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to save host details");
  const data: UserProfilesResponse = await res.json();
  // console.log(data);
  return data;
};

export const getUserDetails = async (id: string) => {
  const res = await fetch(`${baseURL}?userId=${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (res.status === 401) {
    console.warn("Unauthorized – user not logged in.");
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch user details: ${res.statusText}`);
  }

  const data: UserProfilesResponse = await res.json();
  return data;
};

export const updateUserDetails = async (id: string, formData: FormData) => {
  const res = await fetch(`${baseURL}${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to update volunteer details");
  const data: UserProfilesResponse = await res.json();
  // console.log(data);
  return data;
};

export const getAllUserProfiles = async () => {
  const res = await fetch(baseURL, {
    method: "GET",
  });

  if (!res.ok) throw new Error("Failed to save host details");
  const data: UserProfilesResponse = await res.json();
  // console.log(data);
  return data;
};

export const getSingleUserProfile = async (id: string) => {
  const res = await fetch(`${baseURL}/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch single userProfile details: ${res.statusText}`
    );
  }

  const data: UserProfilesResponse = await res.json();
  return data;
};

import { VITE_APP_USER_API_URL } from "@/config";

const baseURL: string = `${VITE_APP_USER_API_URL}/userProfiles`;

export const addUserDetails = async (formData: FormData) => {
  const res = await fetch(baseURL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to save host details");
  const data = await res.json();
  console.log(data);
  return data;
};

export const getUserDetails = async (
  id: string
): Promise<UserProfileFormData | null> => {
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

  const data: UserProfileFormData = await res.json();
  return data;
};

import { authServiceURL } from "@/utils";

export const addUserDetails = async (formData: UserProfileFormData) => {
  const res = await fetch(`${authServiceURL}/userProfiles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) throw new Error("Failed to save volunteer details");
  const data = await res.json();
  console.log(data);
  return data;
};

export const getUserDetails = async (): Promise<UserProfileFormData | null> => {
  const res = await fetch(`${authServiceURL}/userProfiles/me`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
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

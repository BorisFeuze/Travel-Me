import { VITE_APP_USER_API_URL } from "@/config";

const baseURL: string = `${VITE_APP_USER_API_URL}/jobOffers`;

export const addJobOffers = async (formData: FormData) => {
  const res = await fetch(baseURL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to save job offer");
  const data = await res.json();
  console.log("Job offer created:", data);
  return data;
};

export const getJobOffers = async (
  id: string
): Promise<JobOfferFormData | null> => {
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

  const data: JobOfferFormData = await res.json();
  return data;
};

export const updateJobOffers = async (
  id: string,
  formData: FormData
) => {
  const res = await fetch(`${baseURL}/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to update job offer details");
  const data = await res.json();
  console.log(data);
  return data;
};

export const deleteJobOffer = async (id: string) => {
  const res = await fetch(`${baseURL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to delete job offer");
  console.log(`Job offer deleted.`);
};
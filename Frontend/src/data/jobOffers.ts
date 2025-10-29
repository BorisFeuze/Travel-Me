import { VITE_APP_USER_API_URL } from "@/config";

const baseURL: string = `${VITE_APP_USER_API_URL}/jobOffers`;

type JobOffersResponse = {
  message: string;
  jobOffers: JobData[];
};

export const addJobOffers = async (formData: FormData) => {
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  const res = await fetch(baseURL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to save job offer");
  const data = await res.json();
  console.log("Job offer created:", data);
  return data;
};

export const getJobOffers = async (id: string) => {
  const res = await fetch(`${baseURL}?userProfileId=${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (res.status === 401) {
    console.warn("Unauthorized – user not logged in.");
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch job offers: ${res.statusText}`);
  }

  const data: JobOffersResponse = await res.json();
  return data;
};
export const getAllJobOffers = async () => {
  const res = await fetch(`${baseURL}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch job offers: ${res.statusText}`);
  }

  const data: JobOffersResponse = await res.json();
  return data;
};

export const updateJobOffers = async (id: string, formData: FormData) => {
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

type JobOfferDetailResponse = {
  message: string;
  jobOffer: JobData;
};

export const getJobOfferById = async (id: string) => {
  const res = await fetch(`${baseURL}/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    // credentials: "include", // attiva solo se il tuo server richiede cookie/sessione
  });

  if (!res.ok) {
    const err: any = new Error(`Failed to fetch job offer: ${res.statusText}`);
    err.status = res.status; // utile per distinguere 401/403/404 nel client
    throw err;
  }

  const data: JobOfferDetailResponse = await res.json();
  return data;
};

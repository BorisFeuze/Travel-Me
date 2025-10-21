export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5173";

const JobOffersAPI = {
  fetchJobOffers: async () => {
    const response = await fetch(`${API_URL}/job-offers`);
    if (!response.ok) {
      throw new Error("Failed to fetch job offers");
    }
    return response.json();
  },
};

export default JobOffersAPI;

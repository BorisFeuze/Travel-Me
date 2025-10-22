export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const JobOffersAPI = {
  fetchJobOffers: async () => {
    const response = await fetch(`${API_URL}/jobOffers`); // match backend route
    if (!response.ok) {
      throw new Error("Failed to fetch job offers");
    }
    return response.json();
  },
};

// const HostAPI = {
//   fetchHosts: async () => {
//     const response = await fetch(`${API_URL}/hosts`); // which endpoint?
//     if (!response.ok) {
//       throw new Error("Failed to fetch hosts");
//     }
//     return response.json();
//   },
// };

export default { JobOffersAPI, /*HostAPI*/ };

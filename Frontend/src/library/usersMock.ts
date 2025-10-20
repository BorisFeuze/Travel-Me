// src/library/users.ts
export type Gender = "male" | "female" | "other";
export type UserRole = "Volunteer" | "Host";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  continent: string;
  country: string;
  city: string;
  gender: Gender;
  phone: string;
  email: string;
  pictureURL?: string;
  role: UserRole;
  skills: string[];
  languages: string[];
  educations: string[];
  rating?: number;
  reviewsCount?: number;
  hostedCount?: number;
  isSuperhost?: boolean;
};

// ---- All users (volunteers + hosts) live in ONE array ----
export const Users: User[] = [
  {
    id: "u_1",
    firstName: "Julia",
    lastName: "Neumann",
    age: 24,
    continent: "Europe",
    country: "Germany",
    city: "Freiburg",
    gender: "female",
    phone: "+49 123456789",
    email: "julia@email.com",
    pictureURL: "",
    role: "Volunteer",
    skills: ["Cooking", "Farming", "Painting", "Renovation"],
    languages: ["German", "English", "Italian"],
    educations: ["Master of Arts"],
  },
  {
    id: "u_2",
    firstName: "Maria",
    lastName: "Silva",
    age: 24,
    continent: "Europe",
    country: "Germany",
    city: "Freiburg",
    gender: "female",
    phone: "+49 123456789",
    email: "maria@email.com",
    pictureURL: "",
    role: "Volunteer",
    skills: ["Cooking", "Farming", "Painting", "Renovation"],
    languages: ["German", "English", "Italian"],
    educations: ["Master of Arts"],
  },
  {
    id: "u_3",
    firstName: "Maria",
    lastName: "Silva",
    age: 24,
    continent: "Europe",
    country: "Spain",
    city: "Barcelona",
    gender: "female",
    phone: "+34 123456789",
    email: "maria@email.com",
    pictureURL: "",
    role: "Volunteer",
    skills: ["Cooking", "Farming", "Painting", "Renovation"],
    languages: ["Spanish", "English", "Italian"],
    educations: ["Master of Arts"],
  },
  {
    id: "u_4",
    firstName: "Luisa",
    lastName: "Oliveira",
    age: 24,
    continent: "South America",
    country: "Brazil",
    city: "Brasília",
    gender: "female",
    phone: "+55 123456789",
    email: "luisa@email.com",
    pictureURL: "",
    role: "Volunteer",
    skills: ["Cooking", "Farming", "Painting", "Renovation"],
    languages: ["Portuguese", "English", "Italian"],
    educations: ["Master of Arts"],
  },
  {
    id: "u_5",
    firstName: "Annia",
    lastName: "Etienne",
    age: 24,
    continent: "Europe",
    country: "France",
    city: "Paris",
    gender: "female",
    phone: "+33 123456789",
    email: "annia@email.com",
    pictureURL: "",
    role: "Volunteer",
    skills: ["Cooking", "Farming", "Painting", "Renovation"],
    languages: ["French", "English", "Italian"],
    educations: ["Master of Arts"],
  },
  {
    id: "u_6",
    firstName: "Karina",
    lastName: "Rossi",
    age: 24,
    continent: "Europe",
    country: "Italy",
    city: "Rome",
    gender: "female",
    phone: "+39 123456789",
    email: "karina@email.com",
    pictureURL: "",
    role: "Volunteer",
    skills: ["Cooking", "Farming", "Painting", "Renovation"],
    languages: ["Italian", "English", "Spanish"],
    educations: ["Master of Arts"],
  },
  {
    id: "u_7",
    firstName: "Tania",
    lastName: "Youssef",
    age: 24,
    continent: "Africa",
    country: "Egypt",
    city: "Cairo",
    gender: "female",
    phone: "+20 123456789",
    email: "tania@email.com",
    pictureURL: "",
    role: "Volunteer",
    skills: ["Cooking", "Farming", "Painting", "Renovation"],
    languages: ["Arabic", "English", "Italian"],
    educations: ["Master of Arts"],
  },
  {
    id: "u_8",
    firstName: "Ana",
    lastName: "Khan",
    age: 24,
    continent: "Asia",
    country: "India",
    city: "New Delhi",
    gender: "female",
    phone: "+91 123456789",
    email: "ana@email.com",
    pictureURL: "",
    role: "Volunteer",
    skills: ["Cooking", "Farming", "Painting", "Renovation"],
    languages: ["Hindi", "English", "Italian"],
    educations: ["Master of Arts"],
  },

  // --- Hosts (inside the same array) ---
  {
    id: "h_1",
    firstName: "Marco",
    lastName: "Bianchi",
    age: 36,
    continent: "Europe",
    country: "Italy",
    city: "Florence",
    gender: "male",
    phone: "+39 5551234",
    email: "marco@example.com",
    role: "Host",
    pictureURL: "",
    skills: ["Gardening", "Cooking"],
    languages: ["Italian", "English"],
    educations: ["Hospitality Management"],
    rating: 4.9,
    reviewsCount: 128,
    hostedCount: 84,
    isSuperhost: true,
  },
  {
    id: "h_2",
    firstName: "Sofia",
    lastName: "Müller",
    age: 31,
    continent: "Europe",
    country: "Germany",
    city: "Leipzig",
    gender: "female",
    phone: "+49 5551234",
    email: "sofia@example.com",
    role: "Host",
    pictureURL: "",
    skills: ["DIY", "Baking"],
    languages: ["German", "English"],
    educations: ["BSc Architecture"],
    rating: 4.8,
    reviewsCount: 76,
    hostedCount: 52,
    isSuperhost: true,
  },
  {
    id: "h_3",
    firstName: "Diego",
    lastName: "Ramos",
    age: 42,
    continent: "South America",
    country: "Brazil",
    city: "Rio de Janeiro",
    gender: "male",
    phone: "+55 5551234",
    email: "diego@example.com",
    role: "Host",
    pictureURL: "",
    skills: ["Surf coaching", "Renovation"],
    languages: ["Portuguese", "English", "Spanish"],
    educations: ["Civil Engineering"],
    rating: 4.7,
    reviewsCount: 64,
    hostedCount: 40,
    isSuperhost: false,
  },
];

export const UsersAPI = {
  async getTopHosts(limit = 10): Promise<User[]> {
    const hosts = Users.filter((u) => u.role === "Host");
    hosts.sort(
      (a, b) =>
        (b.rating ?? 0) - (a.rating ?? 0) ||
        (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0)
    );
    return hosts.slice(0, limit);
  },
};

export default Users;

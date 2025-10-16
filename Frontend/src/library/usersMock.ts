export type Gender = 'male' | 'female' | 'other';

export type User = {
  id: string;                 // prefer string ids (e.g., UUID)
  firstName: string;
  lastName: string;
  age: number;                // number, not string
  continent: string;          // fixed: "continent" (spelling)
  country: string;
  city: string;
  gender: Gender;             // string union instead of nested booleans
  phone: string;              // keep phone as string for leading zeros/+
  email: string;
  pictureURL?: string;
  role?: 'Volunteer' | 'Host' ;
  skills: string[];           // arrays for list fields
  languages: string[];
  educations: string[];
};

export const Users: User[] = [
  {
    id: 'u_1',
    firstName: 'Maria',
    lastName: 'Silva',
    age: 24,
    continent: 'Europe',        // was "Europa" + misspelled key
    country: 'Germany',
    city: 'Berlin',
    gender: 'female',
    phone: '+49 123456789',
    email: 'maria@email.com',
    pictureURL: '',
    role: 'Volunteer',
    skills: ['Cooking', 'Farming', 'Painting', 'Renovation'],   // array, not bare commas
    languages: ['German', 'English', 'Italian'],                // “Italienisch” -> “Italian” (consistent language)
    educations: ['Master of Arts'],                             // array
  },
];

export default Users;

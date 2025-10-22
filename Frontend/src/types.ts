import type { Url } from "url";

declare global {
  type User = {
    _id?: string;
    firstName: string;
    lastName: string;
    phoneNumber?: number;
    email: string;
    roles: string[];
  };

  type LoginData = {
    email: string;
    password: string;
  };

  type RegisterData = User & {
    password: string;
    confirmPassword: string;
  };

  type AuthContextType = {
    signedIn: boolean | null;
    user: User | null;
    handleSignIn: ({ email, password }: LoginData) => Promise<void>;
    handleSignOut: () => Promise<void>;
    handleRegister: (formState: Omit<RegisterData, "_id">) => Promise<void>;
  };

  type UserProfileFormData = {
    pictureURL?: Url;
    userId: string;
    age?: number;
    continent: string;
    country: string;
    gender: string;
    skills: string[];
    languages: string[];
    educations: string[];
  };

  type JobOfferFormData = {               
  location: string;
  userProfileId: string;       
  pictureGallery: string[];    
  description: string;
  needs?: string[];           
  languages: string[];
  createdAt?: string;         
  updatedAt?: string;
};


  type SuccessRes = { message: string };
}

export type { AuthContextType, User, LoginData, RegisterData };

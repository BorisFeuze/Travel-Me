import type { Url } from "url";

declare global {
  type User = {
    _id: string;
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

  type JobFormData = {   
  _id: string;
  title: string;
  continent: string;
  country: string;           
  location: string;
  userProfileId: string;       
  pictureURL: File[];    
  description: string;
  needs: string[];           
  languages: string[];
  availability: {
    from: Date;
    to: Date;
  }[];
};

  type JobCardData = {
    _id: string;
    image?: string;
    title: string;
    location: string;
  }


  type SuccessRes = { message: string };
}

export type { AuthContextType, User, LoginData, RegisterData, JobFormData, JobCardData, UserProfileFormData };

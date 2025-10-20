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
    handleRegister: (formState: RegisterData) => Promise<void>;
  };

  type UserProfileFormData = {
    pictureURL?: string;
    userId: string;
    age?: number;
    continent: string;
    country: string;
    gender: string;
    skills: string[];
    languages: string[];
    educations: string[];
  };

  type SuccessRes = { message: string };
}

export type { AuthContextType, User, LoginData, RegisterData };

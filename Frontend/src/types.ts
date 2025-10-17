declare global {
  type User = {
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    roles: string[];
  };

  type LoginData = {
    email: string;
    password: string;
  };

  type RegisterData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: number;
    confirmPassword: string;
    roles: string[];
  };

  type AuthContextType = {
    signedIn: boolean;
    user: User | null;
    handleSignIn: ({ email, password }: LoginData) => Promise<void>;
    handleSignOut: () => Promise<void>;
    handleRegister: (formState: RegisterData) => Promise<void>;
  };

  type SuccessRes = { message: string };
}

export type { AuthContextType, User, LoginData, RegisterData };

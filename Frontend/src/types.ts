import type { Dispatch, SetStateAction } from "react";

declare global {
  export type DBEntry = {
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };

  type UserformData = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    roles: string[];
  };

  type User = DBEntry & UserformData;

  type LoginData = {
    email: string;
    password: string;
  };

  type RegisterData = UserformData & {
    password: string;
    confirmPassword: string;
  };

  type AuthContextType = {
    signedIn: boolean | null;
    user: User | null;
    handleSignIn: ({ email, password }: LoginData) => Promise<void>;
    handleSignOut: () => Promise<void>;
    handleRegister: (formState: Omit<RegisterData, "_id">) => Promise<void>;
    checkSession: boolean;
    setCheckSession: Dispatch<SetStateAction<boolean>>;
    onlineUsers: string[];
    socket: Socket | null;
  };

  type UserContextType = {
    allUsers: UserProfileData[];
    getUserProfile: (id: string) => Promise<UserProfilesResponse | null>;
  };

  type UserProfileFormData = {
    pictureURL?: string | File | undefined;
    userId: string;
    age?: number;
    continent: string;
    country: string;
    address: string;
    gender: string;
    description: string;
    skills: string[];
    languages: string[];
    educations: string[];
  };

  type UserProfileData = DBEntry & UserProfileFormData;

  type DateRange = {
    from: Date;
    to: Date;
  };

  type JobFormData = {
    title: string;
    continent: string;
    country: string;
    location: string;
    userProfileId: string;
    pictureURL: File[];
    description: string;
    needs: string[];
    languages: string[];
    availability: DateRange[];
  };

  type JobData = DBEntry & JobFormData;

  type JobCardData = {
    _id: string;
    image?: string;
    title: string;
    location: string;
  };

  type ChatInputType = {
    image?: string;
    message?: string;
  };

  type ChatType = DBEntry &
    ChatInputType & {
      receiverId: string;
      senderId: string;
      seen: boolean;
    };

  type Socket = {
    connected: boolean;
    disconnect: () => Promise<void>;
  };

  type UserProfilesResponse = {
    message: string;
    userProfiles: UserProfileData[];
  };

  type ChatsResponse = {
    chats: ChatType[];
  };

  type UserProfileResp = {
    message: string;
    userProfile: UserProfileData;
  };

  type SuccessRes = { message: string };
}

export type {
  AuthContextType,
  UserformData,
  User,
  LoginData,
  RegisterData,
  JobFormData,
  JobCardData,
  UserProfileFormData,
  UserProfileData,
  ChatType,
  Socket,
  UserContextType,
  JobData,
};

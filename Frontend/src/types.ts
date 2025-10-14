import type { Dispatch, SetStateAction } from "react";

declare global {
  type User = {
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
  };

  type UserCard = {
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    userId: { type: string; required: true };
    points: number;
    score: {
      wins: number;
      losses: number;
    };
    pokemonId: number;
  };

  type Pokemon = {
    id: number;
    name: string;
    sprites: { front_default: string; back_default?: string };
    stats: { stat: { name: string }; base_stat: number }[];
    types: { type: { name: string } }[];
  };

  type LoginData = {
    email: string;
    password: string;
  };

  type RegisterData = {
    firstName: string;
    lastName: string;
    confirmPassword: string;
  } & LoginData;

  type AuthorizContextType = {
    checkSession: boolean;
    signedIn: boolean;
    user: User | null;
    handleSignIn: ({ email, password }: LoginData) => Promise<void>;
    handleSignOut: () => Promise<void>;
    handleRegister: ({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    }: RegisterData) => Promise<void>;
  };

  type UserContextType = {
    checkSession: boolean;
    signedIn: boolean;
    user: User | null;
    handleSignIn: ({ email, password }: LoginData) => Promise<void>;
    handleSignOut: () => Promise<void>;
    handleRegister: ({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    }: RegisterData) => Promise<void>;
  };

  type PokemonContextType = {
    pokemons: Pokemon[];
    setPokemons: Dispatch<SetStateAction<Pokemon[]>>;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    users: User[];
    pokemonId: number;
    setPokemonId: Dispatch<SetStateAction<number>>;
  };

  type BattleContextType = {
    wins: number;
    setWins: Dispatch<SetStateAction<number>>;
    losses: number;
    setLosses: Dispatch<SetStateAction<number>>;
    xp: number;
    setXp: Dispatch<SetStateAction<number>>;
  };

  type SuccessRes = { message: string };
}

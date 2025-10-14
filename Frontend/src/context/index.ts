import { createContext, use } from "react";
import AuthProvider from "./AuthProvider";
import PokemonProvider from "./PokemonProvider";
import BattleProvider from "./BattleProvider";

const AuthorizContext = createContext<AuthorizContextType | undefined>(
  undefined
);

const useAuthor = () => {
  const context = use(AuthorizContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthContextProvider");
  return context;
};

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

const usePokemon = () => {
  const context = use(PokemonContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthContextProvider");
  return context;
};

const BattleContext = createContext<BattleContextType | undefined>(undefined);

const useBattle = () => {
  const context = use(BattleContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthContextProvider");
  return context;
};

export {
  useAuthor,
  AuthProvider,
  AuthorizContext,
  usePokemon,
  PokemonContext,
  PokemonProvider,
  useBattle,
  BattleProvider,
  BattleContext,
};

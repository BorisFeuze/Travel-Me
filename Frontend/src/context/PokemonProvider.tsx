import { useState, useEffect, type ReactNode } from "react";
import { toast } from "react-toastify";
import { PokemonContext } from ".";
import { getPokemons, getUsers } from "../data";

const PokemonProvider = ({ children }: { children: ReactNode }) => {
  // Store events in state
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pokemonId, setPokemonId] = useState<number>(undefined!);

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      try {
        const usersData = await getUsers();

        setUsers(usersData);

        console.log(usersData);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Something went wrong ";
        toast.error(errorMessage);
      }
    })();

    // Cleanup: abort API request when component unmounts
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const dataPokemons = await getPokemons();

        const detailedPokemons = await Promise.all(
          dataPokemons.results.map(async (p: { name: string; url: string }) => {
            const res = await fetch(p.url);
            return await res.json();
          })
        );
        setPokemons(detailedPokemons);
      } catch (err) {
        console.error("Error loading Pokémon:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Provide events state to children via context
  return (
    <PokemonContext
      value={{
        pokemons,
        setPokemons,
        loading,
        setLoading,
        users,
        pokemonId,
        setPokemonId,
      }}
    >
      {children}
    </PokemonContext>
  );
};

export default PokemonProvider;

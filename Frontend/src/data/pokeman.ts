export const getPokemons = async () => {
  const URL = "https://pokeapi.co/api/v2/pokemon?limit=1500";

  // try {
  const res = await fetch(URL);
  if (!res.ok) throw new Error("Something went wrong!");
  const data = await res.json();

  //   const detailedPokemons = await Promise.all(
  //     data.results.map(async (p: { name: string; url: string }) => {
  //       const res = await fetch(p.url);
  //       return await res.json();
  //     })
  //   );

  //   return detailedPokemons;
  // } catch (err) {
  //   console.error("Error loading Pokémon:", err);
  // }

  return data;
};

export const getPokemonById = async (id: string) => {
  const URL = `https://pokeapi.co/api/v2/pokemon/${id}`;

  // try {
  const res = await fetch(URL);
  if (!res.ok) throw new Error("Something went wrong!");
  const data = await res.json();

  return data;
};

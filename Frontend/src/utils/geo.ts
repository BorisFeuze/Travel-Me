export type ContinentKey =
  | "Europe"
  | "Asia"
  | "Africa"
  | "North America"
  | "South America"
  | "Oceania";

const countryToContinent: Record<string, ContinentKey> = {
  Germany: "Europe",
  France: "Europe",
  Spain: "Europe",
  Italy: "Europe",
  "United Kingdom": "Europe",
  Netherlands: "Europe",
  Thailand: "Asia",
  Japan: "Asia",
  China: "Asia",
  Vietnam: "Asia",
  Mexico: "North America",
  USA: "North America",
  Canada: "North America",
  Brazil: "South America",
  Argentina: "South America",
  Australia: "Oceania",
  "New Zealand": "Oceania",
  "South Africa": "Africa",
  Morocco: "Africa",
  Egypt: "Africa",
};

// try find keyword from location
export function continentFromLocation(location?: string): ContinentKey | null {
  if (!location) return null;
  const s = location.toLowerCase();

  // try find common country keywords
  for (const [country, cont] of Object.entries(countryToContinent)) {
    if (s.includes(country.toLowerCase())) return cont;
  }

  // fallback: if it directly contains continent names
  if (s.includes("europe")) return "Europe";
  if (s.includes("asia")) return "Asia";
  if (s.includes("africa")) return "Africa";
  if (s.includes("north america")) return "North America";
  if (s.includes("south america")) return "South America";
  if (s.includes("oceania") || s.includes("australia")) return "Oceania";

  return null;
}

import { useEffect, useState, useMemo } from "react";

/** this could be replaced with API data */
const CONTINENTS = [
  "Europe",
  "Asia",
  "Africa",
  "North America",
  "South America",
  "Oceania",
];
const COUNTRIES: Record<(typeof CONTINENTS)[number], string[]> = {
  Europe: ["Germany", "Italy", "Spain", "Portugal", "Poland", "Austria"],
  Asia: ["Japan", "China", "Thailand", "Vietnam"],
  Africa: ["Morocco", "Kenya", "South Africa"],
  "North America": ["USA", "Canada", "Mexico"],
  "South America": ["Brazil", "Argentina", "Peru"],
  Oceania: ["Australia", "New Zealand"],
};

const PLACES: Record<string, string[]> = {
  Germany: ["Hamburg", "Berlin", "Munich", "Cologne"],
  Italy: ["Rome", "Milan", "Naples", "Florence"],
  Spain: ["Barcelona", "Madrid", "Valencia", "Seville"],
  Portugal: ["Lisbon", "Porto", "Faro"],
  Poland: ["Warsaw", "Krakow", "Gdansk"],
  Austria: ["Vienna", "Salzburg", "Graz"],
  Japan: ["Tokyo", "Osaka", "Kyoto"],
  China: ["Shanghai", "Beijing", "Shenzhen"],
  Thailand: ["Bangkok", "Chiang Mai", "Phuket"],
  Vietnam: ["Hanoi", "Da Nang", "Ho Chi Minh City"],
  // ...add more as needed
};
const SKILLS = [
  "Cooking",
  "Farm work",
  "English Teaching",
  "Gardening",
  "hostel work",
  "Child care",
  "Animal care",
  "Photography",
  "Baking",
  "Surf coaching",
] as const;

type FiltersState = {
  continent?: (typeof CONTINENTS)[number];
  country?: string;
  place?: string;
  skills: string[]; // multi-select
};

type FiltersProps = {
  onChange: (filters: FiltersState) => void;
  initial?: Partial<FiltersState>;
};

// function getCountriesForContinent(continent: string | null): string[] {
//   if (continent && CONTINENTS[continent]) {
//     return COUNTRIES[continent];
//   }
//   return [];
// }

const Filters = ({ onChange, initial }: FiltersProps) => {
  const [continent, setContinent] = useState<FiltersState["continent"]>(
    initial?.continent
  );
  const [country, setCountry] = useState<FiltersState["country"]>(
    initial?.country
  );
  const [place, setPlace] = useState<FiltersState["place"]>(initial?.place);
  const [skills, setSkills] = useState<string[]>(initial?.skills ?? []);

  const countryOptions = useMemo<string[]>(() => {
    if (!continent) return [];
    return COUNTRIES[continent] ?? [];
  }, [continent]);

  const placeOptions = useMemo<string[]>(() => {
    if (!country) return [];
    return PLACES[country] ?? [];
  }, [country]);

  // Keep hierarchy consistent: reset child fields if parent changes
  useEffect(() => {
    setCountry((c) => (c && countryOptions.includes(c) ? c : undefined));
    setPlace(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continent]);

  useEffect(() => {
    setPlace((p) => (p && placeOptions.includes(p) ? p : undefined));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  // Lift state up whenever it changes
  useEffect(() => {
    onChange?.({ continent, country, place, skills });
  }, [continent, country, place, skills]);

  const toggleSkill = (s: string) => {
    setSkills((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const clearAll = () => {
    setContinent(undefined);
    setCountry(undefined);
    setPlace(undefined);
    setSkills([]);
  };

  return (
    <section className="w-full">
      <div className="mx-auto max-w-6xl rounded-[999px] bg-white border shadow-md backdrop-blur px-2 mt-15">
        <div className="flex flex-col md:flex-row md:items-stretch">
          <div className="flex-1 px-4 py-3">
            <div className="text-xs font-semibold text-gray-700">Where</div>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <select
                className="bg-transparent outline-none text-sm text-gray-900 min-w-[140px]"
                value={continent ?? ""}
                onChange={(e) =>
                  setContinent(
                    (e.target.value || undefined) as FiltersState["continent"]
                  )
                }
                aria-label="Continent"
              >
                <option value="">All the continents</option>
                {CONTINENTS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <span className="hidden sm:inline-block h-5 w-px bg-gray-200 mx-1" />

              <select
                className="bg-transparent outline-none text-sm text-gray-900 min-w-[140px] disabled:text-gray-400"
                value={country ?? ""}
                onChange={(e) => setCountry(e.target.value || undefined)}
                disabled={!continent}
                aria-label="Country"
              >
                <option value="">
                  {continent ? "All the continents" : "Choose the continent"}
                </option>
                {countryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <span className="hidden sm:inline-block h-5 w-px bg-gray-200 mx-1" />

              <select
                className="bg-transparent outline-none text-sm text-gray-900 min-w-[140px] disabled:text-gray-400"
                value={place ?? ""}
                onChange={(e) => setPlace(e.target.value || undefined)}
                disabled={!country}
                aria-label="Place"
              >
                <option value="">
                  {country ? "All countries" : "Choose the country"}
                </option>
                {placeOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="hidden md:flex items-center">
            <div className="h-8 w-px bg-gray-200" />
          </div>

          <div className="flex-1 px-4 py-3">
            <div className="text-xs font-semibold text-gray-700">Skills</div>

            <div className="mt-1">
              <div className="dropdown">
                <button
                  tabIndex={0}
                  type="button"
                  className="text-sm text-gray-700 hover:text-gray-900 outline-none"
                >
                  {skills.length
                    ? `${skills.length} selected`
                    : "Select the skills"}
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[5] menu p-2 shadow bg-white border rounded-xl w-64 max-h-72 overflow-auto"
                >
                  {SKILLS.map((s) => (
                    <li key={s}>
                      <label className="label cursor-pointer justify-start gap-3 py-1">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={skills.includes(s)}
                          onChange={() => toggleSkill(s)}
                        />
                        <span className="label-text text-sm">{s}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Pulsante tondo di ricerca */}
          <div className="flex items-center justify-end px-2 py-2 md:py-0">
            <button
              type="button"
              onClick={() => onChange?.({ continent, country, place, skills })}
              aria-label="Cerca"
              className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-current"
                aria-hidden
              >
                <path d="M10 4a6 6 0 104.472 10.026l4.751 4.751 1.414-1.414-4.751-4.751A6 6 0 0010 4zm0 2a4 4 0 110 8 4 4 0 010-8z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Chips skills selezionate + Clear all opzionale */}
      {skills.length > 0 && (
        <div className="max-w-6xl mx-auto mt-2 flex flex-wrap gap-2 px-2">
          {skills.map((s) => (
            <span key={s} className="badge badge-outline gap-1">
              {s}
              <button
                type="button"
                className="ml-1 opacity-70 hover:opacity-100"
                onClick={() => toggleSkill(s)}
                aria-label={`Remove ${s}`}
                title="Remove"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto mt-2 px-2">
        <button
          type="button"
          className="text-sm text-gray-500 hover:underline"
          onClick={clearAll}
        >
          Clear all
        </button>
      </div>
    </section>
  );
};
export default Filters;

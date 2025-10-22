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
    <section className="w-full bg-base-100/80 backdrop-blur rounded-2xl shadow-sm p-4 md:p-6">
      {/* Row: selects */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Continent */}
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-medium">Continent</span>
            {continent && (
              <button
                type="button"
                className="link link-primary text-sm"
                onClick={() => setContinent(undefined)}
              >
                Clear
              </button>
            )}
          </div>
          <select
            className="select select-bordered w-full"
            value={continent ?? ""}
            onChange={(e) =>
              setContinent(
                (e.target.value || undefined) as FiltersState["continent"]
              )
            }
          >
            <option value="">All continents</option>
            {CONTINENTS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        {/* Country (depends on continent) */}
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-medium">Country</span>
            {country && (
              <button
                type="button"
                className="link link-primary text-sm"
                onClick={() => setCountry(undefined)}
              >
                Clear
              </button>
            )}
          </div>
          <select
            className="select select-bordered w-full"
            value={country ?? ""}
            onChange={(e) => setCountry(e.target.value || undefined)}
            disabled={!continent}
          >
            <option value="">
              {continent ? "All countries" : "Select continent first"}
            </option>
            {countryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        {/* Place (depends on country) */}
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-medium">Place</span>
            {place && (
              <button
                type="button"
                className="link link-primary text-sm"
                onClick={() => setPlace(undefined)}
              >
                Clear
              </button>
            )}
          </div>
          <select
            className="select select-bordered w-full"
            value={place ?? ""}
            onChange={(e) => setPlace(e.target.value || undefined)}
            disabled={!country}
          >
            <option value="">
              {country ? "All places" : "Select country first"}
            </option>
            {placeOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        {/* Skills (multi-select as checkboxes → rendered as chips below) */}
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-medium">Skills</span>
            {skills.length > 0 && (
              <button
                type="button"
                className="link link-primary text-sm"
                onClick={() => setSkills([])}
              >
                Clear
              </button>
            )}
          </div>
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn w-full">
              {skills.length ? `${skills.length} selected` : "Select skills"}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-64 max-h-72 overflow-auto"
            >
              {SKILLS.map((s) => (
                <li key={s}>
                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={skills.includes(s)}
                      onChange={() => toggleSkill(s)}
                    />
                    <span className="label-text">{s}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </label>
      </div>

      {/* Selected skill chips */}
      {skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
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

      {/* Action row */}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onChange?.({ continent, country, place, skills })}
        >
          Apply filters
        </button>
        <button type="button" className="btn btn-ghost" onClick={clearAll}>
          Clear all
        </button>
      </div>
    </section>
  );
};

export default Filters;

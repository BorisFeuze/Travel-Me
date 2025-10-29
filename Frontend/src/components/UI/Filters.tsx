import { useEffect, useState } from "react";
import { getAllJobOffers } from "@/data";

export type FiltersState = {
  continent?: string;
  country?: string;
  location?: string;
  skills: string[];
};

export type FiltersProps = {
  onChange: (filters: FiltersState) => void;
  initial?: Partial<FiltersState>;
};

const unique = (arr: (string | undefined | null)[]) =>
  Array.from(new Set(arr.filter((v): v is string => !!v)));

const Filters = ({ onChange, initial }: FiltersProps) => {
  const [jobs, setJobs] = useState<JobFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [continent, setContinent] = useState<FiltersState["continent"]>(
    initial?.continent
  );
  const [country, setCountry] = useState<FiltersState["country"]>(
    initial?.country
  );
  const [location, setLocation] = useState<FiltersState["location"]>(
    initial?.location
  );
  const [skills, setSkills] = useState<string[]>(initial?.skills ?? []);

  const [continentOptions, setContinentOptions] = useState<string[]>([]);
  const [countryOptions, setCountryOptions] = useState<string[]>([]);
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [skillsOptions, setSkillsOptions] = useState<string[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await getAllJobOffers();
        const rows = res?.jobOffers ?? [];
        setJobs(rows);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Failed to load job offers.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  useEffect(() => {
    if (!jobs.length) return;
    setContinentOptions(unique(jobs.map((j: any) => j.continent)));
    setSkillsOptions(
      unique(jobs.flatMap((j: any) => (Array.isArray(j.needs) ? j.needs : [])))
    );
  }, [jobs]);

  useEffect(() => {
    const filtered = jobs.filter((j: any) =>
      continent ? j.continent === continent : true
    );
    const countries = unique(filtered.map((j: any) => j.country));
    setCountryOptions(countries);

    if (country && !countries.includes(country)) {
      setCountry(undefined);
      setLocation(undefined);
    }
  }, [jobs, continent]);

  useEffect(() => {
    const filtered = jobs.filter(
      (j: any) =>
        (continent ? j.continent === continent : true) &&
        (country ? j.country === country : true)
    );
    const locs = unique(filtered.map((j: any) => j.location));
    setLocationOptions(locs);

    if (location && !locs.includes(location)) {
      setLocation(undefined);
    }
  }, [jobs, continent, country]);

  useEffect(() => {
    onChange?.({ continent, country, location, skills });
  }, [continent, country, location, skills]);

  const toggleSkill = (s: string) => {
    setSkills((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const clearAll = () => {
    setContinent(undefined);
    setCountry(undefined);
    setLocation(undefined);
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
                onChange={(e) => setContinent(e.target.value || undefined)}
                aria-label="Continent"
                disabled={loading || !!error}
              >
                <option value="">All continents</option>
                {continentOptions.map((c) => (
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
                disabled={!continent || loading || !!error}
                aria-label="Country"
              >
                <option value="">
                  {continent ? "All countries" : "Choose continent"}
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
                value={location ?? ""}
                onChange={(e) => setLocation(e.target.value || undefined)}
                disabled={!country || loading || !!error}
                aria-label="Location"
              >
                <option value="">
                  {country ? "All locations" : "Choose country"}
                </option>
                {locationOptions.map((p) => (
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
                  disabled={loading || !!error}
                >
                  {skills.length
                    ? `${skills.length} selected`
                    : "Select the skills"}
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-5 menu p-2 shadow bg-white border rounded-xl w-64 max-h-72 overflow-auto"
                >
                  {skillsOptions.map((s) => (
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

          <div className="flex items-center justify-end px-2 py-2 md:py-0">
            <button
              type="button"
              onClick={() =>
                onChange?.({ continent, country, location, skills })
              }
              aria-label="Cerca"
              className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
              disabled={loading || !!error}
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

      {loading && (
        <p className="max-w-6xl mx-auto mt-2 px-2 text-sm text-gray-500">
          Loading filter data…
        </p>
      )}
      {error && (
        <p className="max-w-6xl mx-auto mt-2 px-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </section>
  );
};

export default Filters;

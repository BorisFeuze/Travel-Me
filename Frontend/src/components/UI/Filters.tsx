import { useEffect, useState, useMemo } from "react";
import { getAllJobOffers } from "@/data";
import { X, Filter, ChevronDown } from "lucide-react";

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

  const [open, setOpen] = useState(false);

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

  // opzioni base
  useEffect(() => {
    if (!jobs.length) return;
    setContinentOptions(unique(jobs.map((j: any) => j.continent)));
    setSkillsOptions(
      unique(jobs.flatMap((j: any) => (Array.isArray(j.needs) ? j.needs : [])))
    );
  }, [jobs]);

  // quando cambia continente → paesi
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
  }, [jobs, continent, country]);

  // quando cambia paese → location
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
  }, [jobs, continent, country, location]);

  // notifica il parent
  useEffect(() => {
    onChange?.({ continent, country, location, skills });
  }, [continent, country, location, skills, onChange]);

  const clearAll = () => {
    setContinent(undefined);
    setCountry(undefined);
    setLocation(undefined);
    setSkills([]);
  };

  const hasFilters = useMemo(
    () => !!continent || !!country || !!location || skills.length > 0,
    [continent, country, location, skills]
  );

  // gestione select skills (una o più)
  const handleSkillSelect = (value: string) => {
    if (!value) return;
    // evito duplicati
    setSkills((prev) => (prev.includes(value) ? prev : [...prev, value]));
  };

  const removeSkill = (value: string) => {
    setSkills((prev) => prev.filter((s) => s !== value));
  };

  return (
    <section className="w-full">
      {/* MOBILE BAR */}
      <div className="flex md:hidden items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-black text-white text-sm px-4 py-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasFilters ? (
            <span className="text-[11px] bg-white/20 rounded-full px-2 py-0.5">
              Filters on
            </span>
          ) : null}
        </button>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-slate-500 hover:text-black"
          >
            Clear
          </button>
        )}
      </div>

      {/* DESKTOP FILTERS */}
      <div className="hidden md:block">
        <div className="bg-white border rounded-2xl shadow-sm px-4 py-3 flex flex-wrap gap-3 items-center">
          {/* Continent */}
          <div className="relative">
            <label className="text-[11px] uppercase tracking-wide text-slate-400 block mb-1">
              Continent
            </label>
            <div className="relative">
              <select
                className="appearance-none bg-slate-100/80 border border-transparent hover:border-slate-200 rounded-full py-2 pl-4 pr-8 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-400/50 min-w-[140px]"
                value={continent ?? ""}
                onChange={(e) => setContinent(e.target.value || undefined)}
                disabled={loading || !!error}
              >
                <option value="">All</option>
                {continentOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Country */}
          <div className="relative">
            <label className="text-[11px] uppercase tracking-wide text-slate-400 block mb-1">
              Country
            </label>
            <div className="relative">
              <select
                className="appearance-none bg-slate-100/80 border border-transparent hover:border-slate-200 rounded-full py-2 pl-4 pr-8 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-400/50 min-w-[150px] disabled:text-slate-400"
                value={country ?? ""}
                onChange={(e) => setCountry(e.target.value || undefined)}
                disabled={!continent || loading || !!error}
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
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Location */}
          <div className="relative">
            <label className="text-[11px] uppercase tracking-wide text-slate-400 block mb-1">
              Location
            </label>
            <div className="relative">
              <select
                className="appearance-none bg-slate-100/80 border border-transparent hover:border-slate-200 rounded-full py-2 pl-4 pr-8 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-400/50 min-w-[150px] disabled:text-slate-400"
                value={location ?? ""}
                onChange={(e) => setLocation(e.target.value || undefined)}
                disabled={!country || loading || !!error}
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
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Skills (select) */}
          <div className="relative min-w-[180px]">
            <label className="text-[11px] uppercase tracking-wide text-slate-400 block mb-1">
              Skills
            </label>
            <div className="relative">
              <select
                className="appearance-none bg-slate-100/80 border border-transparent hover:border-slate-200 rounded-full py-2 pl-4 pr-8 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-400/50 w-full"
                value=""
                onChange={(e) => handleSkillSelect(e.target.value)}
                disabled={loading || !!error || skillsOptions.length === 0}
              >
                <option value="">
                  {skills.length ? "Add another skill" : "Select a skill"}
                </option>
                {skillsOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* actions */}
          <div className="flex items-center gap-2 ml-auto">
            {hasFilters && (
              <button
                onClick={clearAll}
                className="text-xs text-slate-500 hover:text-black"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={() =>
                onChange?.({ continent, country, location, skills })
              }
              className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-black text-white hover:bg-slate-900 transition"
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

        {/* pill con le skill scelte */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs"
              >
                {s}
                <button
                  onClick={() => removeSkill(s)}
                  className="text-pink-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* MOBILE SHEET */}
      {open ? (
        <div
          className="fixed inset-0 z-[999] bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CONTINENT */}
            <div className="mb-4">
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Continent
              </label>
              <select
                value={continent ?? ""}
                onChange={(e) => setContinent(e.target.value || undefined)}
                className="w-full bg-slate-100 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400/50"
              >
                <option value="">All</option>
                {continentOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* COUNTRY */}
            <div className="mb-4">
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Country
              </label>
              <select
                value={country ?? ""}
                onChange={(e) => setCountry(e.target.value || undefined)}
                className="w-full bg-slate-100 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400/50"
                disabled={!continent}
              >
                <option value="">
                  {continent ? "All countries" : "Choose continent first"}
                </option>
                {countryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* LOCATION */}
            <div className="mb-4">
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Location
              </label>
              <select
                value={location ?? ""}
                onChange={(e) => setLocation(e.target.value || undefined)}
                className="w-full bg-slate-100 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400/50"
                disabled={!country}
              >
                <option value="">
                  {country ? "All locations" : "Choose country first"}
                </option>
                {locationOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* SKILLS (select) */}
            <div className="mb-4">
              <label className="text-xs font-medium text-slate-500 mb-2 block">
                Skills
              </label>
              <select
                value=""
                onChange={(e) => handleSkillSelect(e.target.value)}
                className="w-full bg-slate-100 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400/50"
              >
                <option value="">
                  {skills.length ? "Add another skill" : "Select a skill"}
                </option>
                {skillsOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs"
                    >
                      {s}
                      <button
                        onClick={() => removeSkill(s)}
                        className="text-pink-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={clearAll}
                className="flex-1 py-2 rounded-full border text-sm font-medium"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  onChange?.({ continent, country, location, skills });
                  setOpen(false);
                }}
                className="flex-1 py-2 rounded-full bg-black text-white text-sm font-medium"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {loading && (
        <p className="mt-2 text-sm text-gray-500">Loading filter data…</p>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </section>
  );
};

export default Filters;

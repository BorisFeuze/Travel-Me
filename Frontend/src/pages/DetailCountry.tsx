import React, { useMemo, useState } from "react";
import type { User } from "@/library/usersMock";
import { Users } from "@/library/usersMock";

// === Immagini continenti ===
import europe from "@/assets/images/continents/europe.jpg";
import africa from "@/assets/images/continents/africa.jpg";
import southamerica from "@/assets/images/continents/southamerica.jpg";
import northamerica from "@/assets/images/continents/northamerica.jpg";
import asia from "@/assets/images/continents/asia.jpg";
import oceania from "@/assets/images/continents/oceania.jpg";

/* ----------------------------- UI helpers ----------------------------- */

const Star = ({ filled = true }: { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden
    className={`h-4 w-4 ${
      filled ? "fill-current" : "fill-transparent stroke-current"
    }`}
  >
    <path d="M12 .917l3.09 6.262 6.91 1.004-5 4.87 1.18 6.885L12 16.96l-6.18 3.978 1.18-6.885-5-4.87 6.91-1.004L12 .917z" />
  </svg>
);

const Select = ({
  value,
  onChange,
  children,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  placeholder: string;
  disabled?: boolean;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    className={`px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20 min-w-[220px] ${
      disabled ? "bg-gray-50 cursor-not-allowed text-gray-400" : "bg-white"
    }`}
  >
    <option value="">{placeholder}</option>
    {children}
  </select>
);

const Chip = ({
  label,
  active = false,
  onClick,
  leading,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  leading?: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-sm border transition shadow-sm flex items-center gap-2 ${
      active
        ? "bg-black text-white border-black"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
    }`}
  >
    {leading}
    {label}
  </button>
);

const HostCard = ({
  host,
  featured = false,
}: {
  host: User;
  featured?: boolean;
}) => (
  <div
    className={`rounded-2xl border p-4 flex flex-col gap-3 shadow-sm ${
      featured ? "bg-gray-50" : "bg-white"
    }`}
  >
    <div className="h-28 rounded-xl bg-gray-200/70" />
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="font-medium">
          {host.firstName} {host.lastName}
        </div>
        <div className="text-xs text-gray-500">
          {host.city}, {host.country}
        </div>
      </div>
      <div className="flex items-center gap-1 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star key={i} filled={i < Math.round(host.rating ?? 0)} />
        ))}
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      {host.skills?.slice(0, 3).map((s) => (
        <span
          key={s}
          className="text-xs px-2 py-0.5 rounded-full bg-gray-100 border"
        >
          {s}
        </span>
      ))}
    </div>
    {host.isSuperhost && (
      <div className="text-[10px] uppercase tracking-wide text-emerald-700 font-semibold">
        Superhost
      </div>
    )}
  </div>
);

/* ----------------------------- Flags (emoji) ------------------------------ */
const FLAG: Record<string, string> = {
  Italy: "🇮🇹",
  Germany: "🇩🇪",
  Spain: "🇪🇸",
  Brazil: "🇧🇷",
  France: "🇫🇷",
  Egypt: "🇪🇬",
  India: "🇮🇳",
};

/* ----------------------------- Main page ------------------------------ */

type ContinentKey =
  | "Europe"
  | "Africa"
  | "South America"
  | "North America"
  | "Asia"
  | "Oceania";

const CONTINENTS: { key: ContinentKey; label: string; img?: string }[] = [
  { key: "Europe", label: "Europe", img: europe },
  { key: "Africa", label: "Africa", img: africa },
  { key: "South America", label: "South America", img: southamerica },
  { key: "North America", label: "North America", img: northamerica },
  { key: "Asia", label: "Asia", img: asia },
  { key: "Oceania", label: "Oceania", img: oceania },
];

export default function DetailCountry() {
  // STATE
  const [selectedContinent, setSelectedContinent] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [search, setSearch] = useState("");

  // Data helpers
  const allContinents = useMemo(
    () => Array.from(new Set(Users.map((u) => u.continent))).sort(),
    []
  );

  const allCountries = useMemo(
    () => Array.from(new Set(Users.map((u) => u.country))).sort(),
    []
  );

  const countriesForContinent = useMemo(
    () =>
      Array.from(
        new Set(
          Users.filter(
            (u) => !selectedContinent || u.continent === selectedContinent
          ).map((u) => u.country)
        )
      ).sort(),
    [selectedContinent]
  );

  const allHosts = useMemo(() => Users.filter((u) => u.role === "Host"), []);

  const filteredHosts = useMemo(() => {
    return allHosts.filter((h) => {
      if (selectedContinent && h.continent !== selectedContinent) return false;
      if (selectedCountry && h.country !== selectedCountry) return false;
      return true;
    });
  }, [allHosts, selectedContinent, selectedCountry]);

  const sortByRating = (a: User, b: User) =>
    (b.rating ?? 0) - (a.rating ?? 0) ||
    (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0);

  const topFilteredHosts = useMemo(
    () => [...filteredHosts].sort(sortByRating).slice(0, 3),
    [filteredHosts]
  );
  const restFilteredHosts = useMemo(
    () => [...filteredHosts].sort(sortByRating).slice(3),
    [filteredHosts]
  );

  const visibleRest = useMemo(() => {
    if (!search.trim()) return restFilteredHosts;
    const q = search.toLowerCase();
    return restFilteredHosts.filter(
      (h) =>
        `${h.firstName} ${h.lastName}`.toLowerCase().includes(q) ||
        h.skills?.some((s) => s.toLowerCase().includes(q))
    );
  }, [restFilteredHosts, search]);

  // Sync handlers (click e select restano allineati)
  const onSelectContinent = (c: string) => {
    setSelectedContinent(c);
    setSelectedCountry(""); // reset paese quando cambio continente
    setSearch("");
  };
  const onSelectCountry = (c: string) => {
    setSelectedCountry(c);
    setSearch("");
  };
  const onClickContinentCard = (key: string) => {
    onSelectContinent(key);
  };

  return (
    <div className="min-h-[85vh] bg-white text-gray-900">
      {/* Header */}
      <div className="max-w-6xl mx-auto pt-20">
        <h1 className="text-4xl md:text-[1-4rem] font-extrabold leading-tight text-gray-800 hero-header-title  rounded-2xl p-2">
          ✈️ Begin your next journey here
        </h1>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-6 pb-30 pt-10">
        {/* FILTRI (select sincronizzati coi click) */}
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={selectedContinent}
            onChange={onSelectContinent}
            placeholder="Select a continent"
          >
            {allContinents.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>

          <Select
            value={selectedCountry}
            onChange={onSelectCountry}
            placeholder={
              selectedContinent ? "Select a country" : "Select a country (all)"
            }
          >
            {(selectedContinent ? countriesForContinent : allCountries).map(
              (c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              )
            )}
          </Select>

          <input
            disabled={!selectedCountry}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className={`px-3 py-2 rounded-xl border border-gray-300 ${
              selectedCountry ? "bg-white" : "bg-gray-50 cursor-not-allowed"
            }`}
          />
        </div>

        {/* CONTINENTI: SEMPRE tutti visibili. Quello selezionato è evidenziato */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {CONTINENTS.map(({ key, label, img }) => {
            const totalHosts = Users.filter(
              (u) => u.role === "Host" && u.continent === key
            ).length;
            const isSelected = selectedContinent === key;
            return (
              <button
                key={key}
                onClick={() => onClickContinentCard(key)}
                className={`relative h-56 rounded-2xl overflow-hidden border bg-gray-100 hover:shadow-md transition ${
                  isSelected ? "ring-2 ring-black" : ""
                }`}
                aria-pressed={isSelected}
              >
                {img && (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                )}
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative h-full w-full flex items-center">
                  <div
                    className={`ml-4 rounded-lg p-3 ${
                      isSelected ? "bg-black/60" : "bg-black/40"
                    }`}
                  >
                    <div className="text-white text-2xl font-semibold">
                      {label}
                    </div>
                    <div className="text-white/90 text-sm">
                      {totalHosts} hosts
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* BANDIERE: mostrate SOLO per il continente selezionato (gli altri continenti restano comunque visibili sopra) */}
        {selectedContinent && (
          <div
            key={selectedContinent}
            className="rounded-2xl border bg-gray-50 p-3 flex flex-wrap gap-2"
          >
            {countriesForContinent.map((c) => (
              <Chip
                key={c}
                label={c}
                active={selectedCountry === c}
                onClick={() => onSelectCountry(c)}
                leading={<span className="text-base">{FLAG[c] ?? "🏳️"}</span>}
              />
            ))}
          </div>
        )}

        {/* HOST: visibili solo dopo scelta country */}
        {selectedCountry && (
          <>
            {/* Top 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topFilteredHosts.map((h) => (
                <HostCard key={h.id} host={h} featured />
              ))}
              {topFilteredHosts.length === 0 && (
                <div className="col-span-full text-sm text-gray-500">
                  Any host for the filters selected.
                </div>
              )}
            </div>

            {/* Lista completa (restanti) */}
            <div className="space-y-4">
              {visibleRest.map((h) => (
                <div
                  key={h.id}
                  className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-6 items-center"
                >
                  <div className="rounded-2xl border shadow-sm p-4 bg-white">
                    <div className="font-medium">
                      {h.firstName} {h.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {h.city}, {h.country}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {h.skills?.map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2 py-0.5 rounded-full bg-gray-100 border"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} filled={i < Math.round(h.rating ?? 0)} />
                      ))}
                      <span className="text-xs text-gray-500">
                        ({h.reviewsCount ?? 0})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {visibleRest.length === 0 && (
                <div className="text-sm text-gray-500">
                  No more host founded.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

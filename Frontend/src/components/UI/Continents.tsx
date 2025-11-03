import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAllJobOffers } from "@/data/jobOffers";

import europe from "@/assets/images/continents/europe.jpg";
import africa from "@/assets/images/continents/africa.jpg";
import southamerica from "@/assets/images/continents/southamerica.jpg";
import northamerica from "@/assets/images/continents/northamerica.jpg";
import asia from "@/assets/images/continents/asia.jpg";
import oceania from "@/assets/images/continents/oceania.jpg";

type JobOffer = {
  _id: string;
  location: string;
  continent?: string;
};

const CONTINENTS = [
  { key: "Europe", label: "Europe", img: europe, color: "bg-sky-100" },
  { key: "Africa", label: "Africa", img: africa, color: "bg-amber-100" },
  {
    key: "South America",
    label: "South America",
    img: southamerica,
    color: "bg-emerald-100",
  },
  {
    key: "North America",
    label: "North America",
    img: northamerica,
    color: "bg-indigo-100",
  },
  { key: "Asia", label: "Asia", img: asia, color: "bg-pink-100" },
  { key: "Oceania", label: "Oceania", img: oceania, color: "bg-cyan-100" },
];

const ContinentCompact = () => {
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await getAllJobOffers();
        setOffers(res?.jobOffers ?? []);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Failed to load job offers.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const getCount = (continent: string) =>
    offers.filter((o) => o.continent === continent).length;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-2xl bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {CONTINENTS.map(({ key, label, img, color }) => {
        const count = getCount(key);

        return (
          <Link
            key={key}
            to={`/continent/${key}`}
            className="
              flex flex-col md:flex-row gap-4
              rounded-2xl border border-slate-200 bg-white
              hover:border-slate-600 hover:shadow-md
              transition cursor-pointer
              p-3
            "
          >
            {/* immagine con badge */}
            <div
              className={`
                relative
                w-full md:w-32 h-28 md:h-24
                rounded-2xl overflow-hidden flex items-center justify-center
                ${color}
              `}
            >
              <img
                src={img}
                alt={label}
                className="w-full h-full object-cover rounded-2xl"
              />

              {count > 0 && (
                <span
                  className="
                    absolute top-2 right-2
                    bg-pink-600 text-white text-xs font-semibold
                    px-2 py-[2px] rounded-full shadow-sm
                  "
                >
                  {count}
                </span>
              )}
            </div>

            {/* testo */}
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
              <p className="text-base md:text-[1.1rem] font-semibold text-slate-900 truncate">
                {label}
              </p>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                {count} opportunities
              </p>
              <span className="inline-flex w-fit items-center gap-1 text-xs border text-slate-900/70 bg-slate-100 px-3 py-1 rounded-full group-hover:bg-slate-900 group-hover:text-white transition">
                Explore
                <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ContinentCompact;

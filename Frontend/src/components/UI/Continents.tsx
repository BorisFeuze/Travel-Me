import { useEffect, useState } from "react";
import { Link } from "react-router";
import JobOffersAPI from "@/library/api";
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

  useEffect(() => {
    (async () => {
      try {
        const data = await JobOffersAPI.JobOffersAPI.fetchJobOffers();
        setOffers(Array.isArray(data.jobOffers) ? data.jobOffers : []);
      } finally {
        setLoading(false);
      }
    })();
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {CONTINENTS.map(({ key, label, img, color }) => {
        const count = getCount(key);

        return (
          <Link
            key={key}
            to={`/continent/${key}`}
            className="
              group flex items-center gap-4
              rounded-2xl border border-slate-300 bg-white
              hover:border-slate-600 hover:shadow-md
              transition cursor-pointer
              p-3
            "
          >
            {/* avatar/immagine tonda */}
            <div
              className={`
                w-40 h-40 rounded-2xl overflow-hidden flex items-center justify-center
                ${color}
              `}
            >
              <img
                src={img}
                alt={label}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>

            {/* testo */}
            <div className="flex-1 min-w-0">
              <p className="text-[1.3rem] font-semibold text-slate-900 truncate">
                {label}
              </p>
              <p className="text-md text-slate-500 flex items-center gap-1">
                {count} Opportunities
              </p>
              <span className="inline-flex items-center gap-1 text-[0.8rem] border text-slate-900/70 bg-slate-100 px-3 mt-5 py-1 rounded-full  group-hover:bg-slate-900 group-hover:text-white transition">
                Explore
                <span aria-hidden>→</span>
              </span>
            </div>

            {/* numero a destra */}
            <div className="flex flex-col text-center">
              <p className="text-md font-semibold text-slate-900">
                {count || 0}
              </p>
              <p className="text-[1rem] text-slate-400">Jobs</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ContinentCompact;

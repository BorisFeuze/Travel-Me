import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { continentFromLocation, type ContinentKey } from "@/utils/geo";
import JobOffersAPI from "@/library/api";
import europe from "@/assets/images/continents/europe.jpg";
import africa from "@/assets/images/continents/africa.jpg";
import southamerica from "@/assets/images/continents/southamerica.jpg";
import northamerica from "@/assets/images/continents/northamerica.jpg";
import asia from "@/assets/images/continents/asia.jpg";
import oceania from "@/assets/images/continents/oceania.jpg";

type JobOffer = {
  _id: string;
  location: string; // "Freiburg, Germany"
  userProfileId: string; // ref to userProfile
  pictureGallery?: string[]; // images
  description: string;
  needs?: string[];
  languages: string[];
  createdAt?: string;
};

const CONTINENTS: {
  key: ContinentKey;
  label: string;
  img?: string;
  anchor: string;
}[] = [
  {
    key: "Europe",
    label: "Europe",
    img: europe,
    anchor: "#europe",
  },
  {
    key: "Africa",
    label: "Africa",
    img: africa,
    anchor: "#africa",
  },
  {
    key: "South America",
    label: "South America",
    img: southamerica,
    anchor: "#south-america",
  },
  {
    key: "North America",
    label: "North America",
    img: northamerica,
    anchor: "#north-america",
  },
  {
    key: "Asia",
    label: "Asia",
    img: asia,
    anchor: "#asia",
  },
  {
    key: "Oceania",
    label: "Oceania",
    img: oceania,
    anchor: "#oceania",
  },
];

const Continent = ({
  mode = "route",
}: {
  /** anchor → <a href="#europe"> ; route → <Link to="/opportunities?continent=Europe"> */
  mode?: "anchor" | "route";
}) => {
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const response =
          await JobOffersAPI.JobOffersAPI.fetchJobOffers(/* add { signal: ac.signal } in your API if desired */);
        // Backend returns {message: '...', jobOffers: [...]}
        const data = response?.jobOffers || response;
        setOffers(Array.isArray(data) ? data : []);
      } catch {
        setErr("Failed to load job offers");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const counts = useMemo(() => {
    const map = new Map<ContinentKey, number>();
    for (const o of offers) {
      const c = continentFromLocation(o.location);
      if (!c) continue;
      map.set(c, (map.get(c) ?? 0) + 1);
    }
    return map;
  }, [offers]);

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Discover by Continent
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (err) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="alert alert-error">
          <span>{err}</span>
          {/* simple retry */}
          <button
            className="btn btn-sm ml-auto"
            onClick={() => location.reload()}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="continents" className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">
        Discovery by Continent
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {CONTINENTS.map(({ key, label, img, anchor }) => {
          const total = counts.get(key) ?? 0;
          // if (total === 0) return null; //  skip continents with no offers

          const Card = (
            <div
              className="relative h-64 rounded-2xl overflow-hidden bg-base-200 hover:shadow-md transition-shadow"
              aria-label={`${label} - ${total} opportunities`}
            >
              {img && (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${img})` }}
                />
              )}
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative h-full w-full flex items-center justify-between px-5">
                <div className="text-base-100 bg-black/40 p-3 rounded-lg absolute top-3 left-4 tooltip tooltip-left">
                  <div className="text-3xl font-semibold">{label}</div>
                  <div className="text-lg opacity-90">
                    {total} opportunities
                  </div>
                </div>
                <div className="badge badge-primary p-5 mask-origin-border absolute bottom-12 left-4 tooltip tooltip-left">
                  Find opportunities in {label}
                </div>
              </div>
            </div>
          );

          // anchor mode → link to section IDs like #europe (works with your JobByContinent sections)
          if (mode === "anchor") {
            return (
              <a
                key={key}
                href={anchor}
                className="block focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {Card}
              </a>
            );
          }

          // route mode → go to listing page with query
          return (
            <Link
              key={key}
              to={`/opportunities?continent=${encodeURIComponent(key)}`}
              className="block focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {Card}
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Continent;

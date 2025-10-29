import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  { key: "Europe", label: "Europe", img: europe },
  { key: "Africa", label: "Africa", img: africa },
  { key: "South America", label: "South America", img: southamerica },
  { key: "North America", label: "North America", img: northamerica },
  { key: "Asia", label: "Asia", img: asia },
  { key: "Oceania", label: "Oceania", img: oceania },
];

const Continent = () => {
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

  if (loading) return <div>Loading...</div>;

  const getCount = (continent: string) =>
    offers.filter((o) => o.continent === continent).length;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-8">
        🌎 Discover opportunities across every continent
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {CONTINENTS.map(({ key, label, img }) => (
          <Link
            key={key}
            to={`/continent/${key}`}
            className="relative h-64 rounded-2xl overflow-hidden hover:shadow-xl transform transition-transform duration-300 hover:scale-105"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${img})` }}
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 p-4 text-white font-bold text-xl">
              {label} ({getCount(key)})
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Continent;

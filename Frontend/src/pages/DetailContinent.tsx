import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import JobOffersAPI from "@/library/api";

type JobOffer = {
  _id: string;
  location: string;
  description: string;
  continent?: string;
};

const DetailContinent = () => {
  const { continent } = useParams<{ continent: string }>();
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await JobOffersAPI.JobOffersAPI.fetchJobOffers();
        // Filter nur die JobOffers für den ausgewählten Kontinent
        const filtered = (data.jobOffers || []).filter(
          (o: JobOffer) => o.continent === continent
        );
        setOffers(filtered);
      } finally {
        setLoading(false);
      }
    })();
  }, [continent]);

  if (loading) return <div>Loading...</div>;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-8">
        {continent} - Job Opportunities
      </h1>

      {offers.length === 0 ? (
        <p>No job offers found for {continent}.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="p-4 border rounded hover:shadow transition-shadow duration-200"
            >
              <h2 className="font-semibold text-lg mb-2">{offer.location}</h2>
              <p className="text-gray-700">{offer.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default DetailContinent;

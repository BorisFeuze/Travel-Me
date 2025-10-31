import { useEffect, useState, useMemo } from "react";
import { getAllUserProfiles } from "@/data";
import { Link, useSearchParams } from "react-router-dom";
import { continentFromLocation, type ContinentKey } from "@/utils/geo";

type JobOffer = {
  _id: string;
  location: string;
  userProfileId: string;
  pictureGallery?: string[];
  description: string;
  needs?: string[];
  languages: string[];
  createdAt?: string;
};

const CONTINENT_ORDER: ContinentKey[] = [
  "Europe",
  "Asia",
  "Africa",
  "North America",
  "South America",
  "Oceania",
];

const SAMPLE_OFFERS: JobOffer[] = [
  {
    _id: "mock_1",
    location: "Freiburg, Germany",
    userProfileId: "h_1",
    pictureGallery: ["https://via.placeholder.com/300x200?text=Garden+Work"],
    description: "Help with garden and light renovation tasks.",
    needs: ["Gardening", "Renovation", "Painting"],
    languages: ["German", "English"],
  },
  {
    _id: "mock_2",
    location: "Rome, Italy",
    userProfileId: "h_3",
    pictureGallery: ["https://via.placeholder.com/300x200?text=Hostel+Work"],
    description: "Assist with hostel reception and cooking.",
    needs: ["Hostel work", "Cooking"],
    languages: ["Italian", "English"],
  },
  {
    _id: "mock_3",
    location: "Bangkok, Thailand",
    userProfileId: "h_4",
    pictureGallery: ["https://via.placeholder.com/300x200?text=Teaching"],
    description: "Teach English and help with farm work.",
    needs: ["Teaching", "Farming"],
    languages: ["English", "Thai"],
  },
  {
    _id: "mock_4",
    location: "São Paulo, Brazil",
    userProfileId: "h_5",
    pictureGallery: ["https://via.placeholder.com/300x200?text=Eco+Farm"],
    description: "Work on sustainable eco-farm project.",
    needs: ["Farming", "Construction"],
    languages: ["Portuguese", "English"],
  },
  {
    _id: "mock_5",
    location: "Cape Town, South Africa",
    userProfileId: "h_6",
    pictureGallery: ["https://via.placeholder.com/300x200?text=Wildlife"],
    description: "Wildlife conservation and research assistance.",
    needs: ["Research", "Animal Care"],
    languages: ["English", "Afrikaans"],
  },
];

function groupByContinent(list: JobOffer[]) {
  return list.reduce<Record<ContinentKey, JobOffer[]>>(
    (acc, j) => {
      const c = continentFromLocation(j.location);
      if (!c) return acc;
      (acc[c] ??= []).push(j);
      return acc;
    },
    {} as Record<ContinentKey, JobOffer[]>
  );
}

const JobByContinent = () => {
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await getAllUserProfiles();
        // qui puoi decidere se filtrare o trasformare i dati reali
        setOffers(SAMPLE_OFFERS); // per ora fallback
      } catch (e) {
        console.error("Failed to load job offers:", e);
        setOffers(SAMPLE_OFFERS);
        setErr(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const grouped = useMemo(() => groupByContinent(offers), [offers]);
  const [searchParams] = useSearchParams();
  const selectedRaw = searchParams.get("continent");
  const selected = selectedRaw ? decodeURIComponent(selectedRaw) : null;

  const continents = useMemo(() => {
    const available = CONTINENT_ORDER.filter((c) => grouped[c]?.length);
    if (selected && available.includes(selected as ContinentKey)) {
      return [selected as ContinentKey];
    }
    return available;
  }, [grouped, selected]);

  if (loading)
    return <div className="mx-auto max-w-6xl px-4 py-10">Loading…</div>;
  if (err)
    return <div className="mx-auto max-w-6xl px-4 py-10 text-error">{err}</div>;
  if (continents.length === 0)
    return <div className="mx-auto max-w-6xl px-4 py-10">No data.</div>;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 space-y-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        🌍 Job Offers by Continent
      </h1>

      {continents.map((continent) => {
        const jobs = grouped[continent]!;
        return (
          <div key={continent}>
            {/* header */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100">
                  {continent}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {jobs.length} opportunities available
                </p>
              </div>
              <Link
                to={`/?continent=${continent}`}
                className="text-sm text-lime-600 hover:text-lime-400 transition"
              >
                View all →
              </Link>
            </div>

            {/* responsive job grid */}
            <div
              className="
                grid gap-4
                grid-cols-1
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
              "
            >
              {jobs.map((job) => {
                const img = job.pictureGallery?.[0];
                return (
                  <article
                    key={job._id}
                    className="
                      bg-white dark:bg-slate-800
                      rounded-2xl border border-slate-200 dark:border-slate-700
                      overflow-hidden shadow-sm hover:shadow-md
                      transition duration-200
                      flex flex-col
                    "
                  >
                    {img && (
                      <img
                        src={img}
                        alt={job.location}
                        className="h-40 w-full object-cover"
                      />
                    )}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white leading-tight line-clamp-2">
                        {job.location}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-300 line-clamp-3 mt-1">
                        {job.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {job.needs?.slice(0, 3).map((n) => (
                          <span
                            key={n}
                            className="px-2 py-0.5 text-[11px] bg-lime-100 text-lime-800 rounded-full dark:bg-lime-900/40 dark:text-lime-300"
                          >
                            {n}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto pt-3">
                        <Link
                          to={`/opportunity/${job._id}`}
                          className="inline-block text-center w-full text-sm font-medium bg-lime-500 hover:bg-lime-400 text-white rounded-lg py-1.5 transition"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default JobByContinent;

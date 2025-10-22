import { useEffect, useState, useMemo } from "react";
import JobOffersAPI from "@/library/api";
import { Link, useSearchParams } from "react-router-dom";
import { continentFromLocation, type ContinentKey } from "@/utils/geo";

type JobOffer = {
  _id: string;
  location: string; // "Freiburg, Germany, Europe"
  userProfileId: string; // ref to userProfile
  pictureGallery?: string[]; // images
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

// Fallback sample job offers used when fetch fails (quick local mock)
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
  return list.reduce<Record<ContinentKey, JobOffer[]>>((acc, j) => {
    const c = continentFromLocation(j.location);
    if (!c) return acc;
    (acc[c] ??= []).push(j);
    return acc;
  }, {} as Record<ContinentKey, JobOffer[]>);
}

const JobByContinent = () => {
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await JobOffersAPI.JobOffersAPI.fetchJobOffers();
        // Backend returns {message: '...', jobOffers: [...]}
        const data = response?.jobOffers || response;
        setOffers(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load job offers from API:", e);
        // fallback to local sample data so homepage still shows content
        setOffers(SAMPLE_OFFERS);
        // do not set a fatal error so UI can render fallback; optionally set a non-fatal message
        setErr(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // group offers by detected continent
  const grouped = useMemo(() => groupByContinent(offers), [offers]);

  // read optional ?continent=Europe query param and show only that continent when present
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
      <h1 className="text-3xl font-bold">Job Offers by Continent</h1>
      {continents.map((continent) => {
        const jobs = grouped[continent]!;
        return (
          <div key={continent}>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">{continent}</h2>
                <p className="text-sm text-base-content/60">
                  {jobs.length} opportunities
                </p>
              </div>
            </div>

            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
              {jobs.map((job) => {
                const img = job.pictureGallery?.[0];
                return (
                  <article
                    key={job._id}
                    className="card min-w-[270px] max-w-[300px] bg-base-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {img && (
                      <figure className="h-36 overflow-hidden">
                        <img
                          src={img}
                          alt={job.location}
                          className="h-full w-full object-cover"
                        />
                      </figure>
                    )}
                    <div className="card-body p-4">
                      <h3 className="font-semibold leading-tight line-clamp-2">
                        {job.location}
                      </h3>

                      <p className="text-xs text-base-content/60 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {job.needs?.slice(0, 3).map((n) => (
                          <span
                            key={n}
                            className="badge badge-outline badge-sm"
                          >
                            {n}
                          </span>
                        ))}
                        {job.languages?.slice(0, 2).map((lng) => (
                          <span
                            key={lng}
                            className="badge badge-ghost badge-sm"
                          >
                            {lng}
                          </span>
                        ))}
                      </div>

                      <div className="card-actions mt-4">
                        <Link
                          to={`/opportunity/${job._id}`}
                          className="btn btn-sm btn-primary w-full"
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

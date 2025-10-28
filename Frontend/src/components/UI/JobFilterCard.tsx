import { useEffect, useState } from "react";
import { getAllJobOffers } from "@/data";
import Filters from "./Filters";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router";

type JobOffersListProps = {
  initial?: Partial<{
    continent: string;
    country: string;
    location: string;
    skills: string[];
  }>;
};

const JobFilterCard = ({ initial }: JobOffersListProps) => {
  const [jobs, setJobs] = useState<JobFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    skills: [] as string[],
    ...initial,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await getAllJobOffers();
        setJobs(res?.jobOffers ?? []);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Failed to load job offers.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    if (
      (filters as any).continent &&
      job.continent !== (filters as any).continent
    )
      return false;
    if ((filters as any).country && job.country !== (filters as any).country)
      return false;
    if ((filters as any).location && job.location !== (filters as any).location)
      return false;
    if (filters.skills && filters.skills.length) {
      const needs = Array.isArray(job.needs) ? job.needs : [];
      const allIncluded = filters.skills.every((s) => needs.includes(s));
      if (!allIncluded) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <p className="text-center p-10 text-gray-500">Loading job offers...</p>
    );
  }
  if (error) {
    return <p className="text-center p-10 text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Job Offers</h1>
          <button
            onClick={() => setFilters({ skills: [] })}
            className="text-sm px-3 py-1.5 rounded-full border border-gray-300 hover:bg-gray-100 transition"
          >
            Reset
          </button>
        </div>

        <div className="mb-4">
          <Filters initial={filters} onChange={(f) => setFilters(f)} />
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-600">
            {filteredJobs.length} result{filteredJobs.length === 1 ? "" : "s"}
          </p>
        </div>

        {filteredJobs.length === 0 ? (
          <p className="text-center p-10 text-gray-500">
            No job offers match your filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredJobs.map((job) => (
              <article
                key={job._id}
                className="relative bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition"
              >
                {/* COVER IMAGE */}
                {job.pictureURL?.length ? (
                  <img
                    src={
                      typeof job.pictureURL[0] === "string"
                        ? (job.pictureURL[0] as string)
                        : URL.createObjectURL(job.pictureURL[0] as File)
                    }
                    alt={job.title}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="h-40 w-full bg-gray-200" />
                )}

                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {job.title}
                  </h2>

                  <p className="text-sm text-gray-500 mt-2">
                    {job.continent && job.country
                      ? `${job.continent}, ${job.country}`
                      : job.country || job.continent}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    {job.location ?? ""}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {(job.needs || []).slice(0, 4).map((need, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-xs font-medium"
                      >
                        {need}
                      </span>
                    ))}
                    {job.needs?.length > 4 && (
                      <span className="text-xs text-gray-500">
                        +{job.needs.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => navigate(`/job/${job._id}`)}
                      className="text-sm px-3 py-1.5 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                    >
                      Details
                    </button>
                    <button
                      onClick={() =>
                        console.log("Navigate to chat", job.userProfileId)
                      }
                      className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full transition"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Contact
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobFilterCard;

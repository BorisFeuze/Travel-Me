import { useEffect, useState, useCallback } from "react";
import { getAllJobOffers } from "@/data";
import Filters from "./Filters";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/context";

type JobOffersListProps = {
  initial?: Partial<{
    continent: string;
    country: string;
    location: string;
    skills: string[];
  }>;
};

// skeleton (versione più piccola)
const JobCardSkeleton = () => (
  <div className="bg-white border rounded-xl overflow-hidden shadow-sm animate-pulse flex flex-col">
    <div className="w-full aspect-[16/10] bg-slate-200" />
    <div className="p-3 space-y-2 flex-1 flex flex-col">
      <div className="h-3.5 bg-slate-200 rounded w-2/3" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
      <div className="h-3 bg-slate-100 rounded w-1/3" />
      <div className="flex gap-2 mt-auto">
        <div className="h-7 bg-slate-200 rounded-full flex-1" />
        <div className="h-7 bg-slate-100 rounded-full flex-1" />
      </div>
    </div>
  </div>
);

const JobFilterCard = ({ initial }: JobOffersListProps) => {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    skills: [] as string[],
    ...initial,
  });
  const [visibleCount, setVisibleCount] = useState(8); // di base 8 per la griglia a 4

  const { user } = useAuth();
  const navigate = useNavigate();

  const userName = user?.firstName || "Traveller";
  const userRole = Array.isArray(user?.roles) ? user!.roles[0] : undefined;

  const handleFiltersChange = useCallback((f: any) => {
    setFilters(f);
  }, []);

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

  // quando cambiano i filtri, resetto il numero
  useEffect(() => {
    setVisibleCount(8);
  }, [filters]);

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

  const visibleJobs = filteredJobs.slice(0, visibleCount);

  return (
    <div className="max-w-full bg-white pb-10">
      {/* header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-3 pt-5 pb-3">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-semibold text-black leading-tight">
              Hello {userName}!
            </h1>
            {userRole && (
              <span
                className={`text-[11px] px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                  userRole === "volunteer"
                    ? "bg-lime-500 text-white"
                    : "bg-pink-500 text-white"
                }`}
              >
                {userRole === "volunteer" ? "Volunteer" : "Host"}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Welcome to Travel 👋
          </p>
        </div>
      </header>

      {/* filters */}
      <div className="px-3 mb-3">
        <div className="rounded-xl p-3 bg-white border border-slate-100">
          <Filters initial={filters} onChange={handleFiltersChange} />
        </div>
      </div>

      {/* subtitle */}
      <div className="px-3 mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm sm:text-base font-medium text-black">
          {loading
            ? "Loading results…"
            : `${filteredJobs.length} result${
                filteredJobs.length === 1 ? "" : "s"
              }`}
        </h2>
        {!loading && filteredJobs.length > visibleCount && (
          <button
            onClick={() => setVisibleCount(filteredJobs.length)}
            className="text-xs sm:text-sm text-black/80 hover:text-black"
          >
            View all
          </button>
        )}
      </div>

      {/* jobs */}
      {error ? (
        <div className="text-red-500 px-3 py-10 text-sm text-center">
          {error}
        </div>
      ) : loading ? (
        <div className="px-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : visibleJobs.length === 0 ? (
        <p className="text-center text-black py-8 text-sm">
          No job offers match your filters.
        </p>
      ) : (
        <>
          <div className="px-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {visibleJobs.map((job) => (
              <article
                key={job._id}
                className="bg-white border rounded-xl overflow-hidden hover:border-pink-400/70 transition shadow-sm flex flex-col"
              >
                {job.pictureURL?.length ? (
                  <div className="relative w-full aspect-[16/10] bg-slate-200">
                    <img
                      src={
                        typeof job.pictureURL[0] === "string"
                          ? (job.pictureURL[0] as string)
                          : URL.createObjectURL(job.pictureURL[0] as File)
                      }
                      alt={job.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[16/10] bg-slate-100" />
                )}

                <div className="p-3 flex flex-col gap-1.5 flex-1">
                  <h3 className="text-sm font-semibold text-black line-clamp-1 capitalize">
                    {job.title}
                  </h3>

                  <p className="text-xs text-black capitalize">
                    {job.continent && job.country
                      ? `${job.continent}, ${job.country}`
                      : job.country || job.continent}
                  </p>
                  {job.location ? (
                    <p className="text-[11px] text-slate-500">{job.location}</p>
                  ) : null}

                  <div className="flex flex-wrap gap-1 mt-1 mb-1">
                    {(job.needs || []).slice(0, 3).map((need, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 bg-pink-600 text-white rounded-full text-[10px]"
                      >
                        {need}
                      </span>
                    ))}
                    {job.needs?.length > 3 && (
                      <span className="text-[10px] text-slate-500 self-center">
                        +{job.needs.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto flex gap-1.5 pt-1">
                    <button
                      onClick={() => navigate(`/job/${job._id}`)}
                      className="flex-1 text-xs px-2 py-1.5 rounded-full bg-black text-white hover:bg-white hover:text-black border border-transparent hover:border-black transition text-center"
                    >
                      Details
                    </button>
                    <button
                      onClick={() =>
                        console.log("Navigate to chat", job.userProfileId)
                      }
                      className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded-full bg-slate-100 text-black hover:bg-black hover:text-white transition"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Contact
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {visibleCount < filteredJobs.length && (
            <div className="flex justify-center pt-6">
              <button
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="px-4 py-2 text-sm font-medium border bg-white text-slate-950 rounded-full hover:bg-black hover:text-white transition"
              >
                Show more...
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobFilterCard;

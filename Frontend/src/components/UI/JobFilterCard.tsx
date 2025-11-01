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

// skeleton
const JobCardSkeleton = () => (
  <div className="bg-white border rounded-2xl overflow-hidden shadow-sm animate-pulse flex flex-col">
    <div className="w-full aspect-[16/9] bg-slate-200" />
    <div className="p-4 space-y-3 flex-1 flex flex-col">
      <div className="h-4 bg-slate-200 rounded w-2/3" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
      <div className="h-3 bg-slate-100 rounded w-1/3" />
      <div className="flex gap-2 mt-auto">
        <div className="h-8 bg-slate-200 rounded-full flex-1" />
        <div className="h-8 bg-slate-100 rounded-full flex-1" />
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
  const [visibleCount, setVisibleCount] = useState(6);

  const { user } = useAuth();
  const navigate = useNavigate();

  const userName = user?.firstName || "Traveller";
  const userRole = Array.isArray(user?.roles) ? user!.roles[0] : undefined;

  // 👇 MEMOIZZATO → non cambia ad ogni render
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
    setVisibleCount(6);
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
    <div className="mx-auto max-w-6xl bg-white pb-10">
      {/* header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 pt-6 pb-3">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-semibold text-black leading-tight">
              Hello {userName}!
            </h1>
            {userRole && (
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                  userRole === "volunteer"
                    ? "bg-lime-500 text-white"
                    : "bg-pink-500 text-white"
                }`}
              >
                {userRole === "volunteer" ? "Volunteer" : "Host"}
              </span>
            )}
          </div>
          <p className="text-sm sm:text-base text-slate-400 mt-1">
            Welcome to Travel 👋
          </p>
        </div>
      </header>

      {/* filters */}
      <div className="px-4 mb-4">
        <div className="rounded-xl p-3 bg-white">
          <Filters initial={filters} onChange={handleFiltersChange} />
        </div>
      </div>

      {/* subtitle */}
      <div className="px-4 mb-3 flex items-center justify-between gap-2">
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
        <div className="text-red-500 px-4 py-10 text-sm text-center">
          {error}
        </div>
      ) : loading ? (
        <div className="px-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : visibleJobs.length === 0 ? (
        <p className="text-center text-black py-8 text-sm">
          No job offers match your filters.
        </p>
      ) : (
        <>
          <div className="px-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {visibleJobs.map((job) => (
              <article
                key={job._id}
                className="bg-white border rounded-2xl overflow-hidden hover:border-pink-400/70 transition shadow-sm flex flex-col"
              >
                {job.pictureURL?.length ? (
                  <div className="relative w-full aspect-[16/9] bg-slate-200">
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
                  <div className="w-full aspect-[16/9] bg-slate-100" />
                )}

                <div className="p-4 flex flex-col gap-2 flex-1">
                  <h3 className="text-base font-semibold text-black line-clamp-1 capitalize">
                    {job.title}
                  </h3>

                  <p className="text-sm text-black capitalize">
                    {job.continent && job.country
                      ? `${job.continent}, ${job.country}`
                      : job.country || job.continent}
                  </p>
                  {job.location ? (
                    <p className="text-xs text-slate-500">{job.location}</p>
                  ) : null}

                  <div className="flex flex-wrap gap-2 mb-1">
                    {(job.needs || []).slice(0, 3).map((need, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-pink-600 text-white rounded-full text-[11px]"
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

                  <div className="mt-auto flex gap-2 pt-2">
                    <button
                      onClick={() => navigate(`/job/${job._id}`)}
                      className="flex-1 text-sm px-3 py-1.5 rounded-full bg-black text-white hover:bg-white hover:text-black border border-transparent hover:border-black transition text-center"
                    >
                      Details
                    </button>
                    <button
                      onClick={() =>
                        console.log("Navigate to chat", job.userProfileId)
                      }
                      className="flex-1 flex items-center justify-center gap-1 text-sm px-3 py-1.5 rounded-full bg-slate-100 text-black hover:bg-black hover:text-white transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
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
                onClick={() => setVisibleCount((prev) => prev + 6)}
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

import { useEffect, useState } from "react";
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

const JobFilterCard = ({ initial }: JobOffersListProps) => {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    skills: [] as string[],
    ...initial,
  });
  const [visibleCount, setVisibleCount] = useState(3);

  const { user } = useAuth();
  const navigate = useNavigate();

  // 👇 username
  const userName = user?.firstName || "Traveller";

  // 👇 ruolo: prendo il primo dell’array se esiste
  const userRole = Array.isArray(user?.roles) ? user!.roles[0] : undefined;
  // valori possibili che hai detto tu: "volunteer" oppure "host"

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

  useEffect(() => {
    setVisibleCount(3);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center text-sm">
        Loading job offers...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-white text-red-500 flex items-center justify-center text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className=" mx-auto max-w-full bg-white">
      {/* header */}
      <header className="flex items-center justify-between px-5 pt-5 pb-2">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[3rem] font-semibold text-black leading-none">
              Hello {userName}!
            </h1>

            {/* badge ruolo */}
            {userRole && (
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  userRole === "volunteer"
                    ? "bg-lime-500 text-white"
                    : "bg-pink-500 text-white"
                }`}
              >
                {userRole === "volunteer" ? "Volunteer" : "Host"}
              </span>
            )}
          </div>
          <p className="text-[1rem] text-slate-400 mt-1">
            Welcome to Travel 👋
          </p>
        </div>
      </header>

      {/* filters */}
      <div className="px-5 mb-3">
        <div className="rounded-xl p-3">
          <Filters initial={filters} onChange={(f) => setFilters(f)} />
        </div>
      </div>

      {/* subtitle */}
      <div className="px-5 mb-2 flex items-center justify-between">
        <h2 className="text-base font-medium text-black">
          {filteredJobs.length} result{filteredJobs.length === 1 ? "" : "s"}
        </h2>
        <button
          onClick={() => setVisibleCount(filteredJobs.length)}
          className="text-xs text-black hover:text-gray-800"
        >
          View all
        </button>
      </div>

      {/* job grid */}
      {visibleJobs.length === 0 ? (
        <p className="text-center text-black py-8 text-sm">
          No job offers match your filters.
        </p>
      ) : (
        <>
          <div className="px-5 grid grid-cols-1 md:grid-cols-3 gap-5 pb-8">
            {visibleJobs.map((job) => (
              <article
                key={job._id}
                className="bg-white border rounded-2xl overflow-hidden hover:border-pink-400/60 transition shadow-md"
              >
                {job.pictureURL?.length ? (
                  <img
                    src={
                      typeof job.pictureURL[0] === "string"
                        ? (job.pictureURL[0] as string)
                        : URL.createObjectURL(job.pictureURL[0] as File)
                    }
                    alt={job.title}
                    className="h-36 w-full object-cover"
                  />
                ) : (
                  <div className="h-36 w-full bg-slate-200" />
                )}

                <div className="p-4 space-y-2">
                  <h3 className="text-md font-semibold text-black line-clamp-1 capitalize">
                    {job.title}
                  </h3>

                  <p className="text-md text-black capitalize">
                    {job.continent && job.country
                      ? `${job.continent}, ${job.country}`
                      : job.country || job.continent}
                  </p>
                  <p className="text-xs text-slate-500">{job.location ?? ""}</p>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {(job.needs || []).slice(0, 3).map((need, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-pink-600 text-white rounded-full text-xs"
                      >
                        {need}
                      </span>
                    ))}
                    {job.needs?.length > 3 && (
                      <span className="text-[10px] text-slate-500">
                        +{job.needs.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/job/${job._id}`)}
                      className="text-sm px-3 py-1 rounded-full bg-black text-white hover:bg-white hover:text-black transition"
                    >
                      Details
                    </button>
                    <button
                      onClick={() =>
                        console.log("Navigate to chat", job.userProfileId)
                      }
                      className="flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-black text-white hover:bg-white hover:text-black transition"
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
            <div className="flex justify-center pb-8">
              <button
                onClick={() => setVisibleCount((prev) => prev + 3)}
                className="px-3 py-1.5 text-sm font-medium border bg-slate-100 text-slate-950 rounded-full hover:bg-black hover:text-white transition"
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

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers } from "@/data";
import CardHost from "./CardHost";

type HostSummary = {
  _id: string;
  firstName: string;
  email: string;
};

const TopHosts = () => {
  const [displayedHosts, setDisplayedHosts] = useState<HostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const dataUsers = await getUsers();
        const filteredHost = dataUsers.users.filter((u: any) =>
          u.roles.includes("host")
        );
        setDisplayedHosts(filteredHost);
      } catch {
        setError("Error fetching top hosts");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto w-full px-4 pt-16 pb-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
                Discover
              </p>
              <h2 className="text-2xl font-bold text-slate-900">Top Hosts</h2>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-64 shrink-0 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm"
              >
                <div className="mb-3 h-10 w-10 rounded-full bg-slate-200" />
                <div className="mb-2 h-4 w-32 rounded bg-slate-200" />
                <div className="h-3 w-44 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto w-full px-4 pt-16 pb-10">
        <div className="mx-auto max-w-6xl text-red-600">{error}</div>
      </section>
    );
  }

  if (displayedHosts.length === 0) {
    return (
      <section className="mx-auto w-full px-4 pt-16 pb-10">
        <div className="mx-auto max-w-6xl text-slate-600">
          No top hosts found.
        </div>
      </section>
    );
  }

  return (
    <section id="TopHosts" className="mx-auto w-full px-4 pt-16 pb-12">
      <div className="max-w-full">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
              Community
            </p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Top Hosts
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-md">
              Discover the most active and reliable hosts on the platform. Click
              on a profile to see more details.
            </p>
          </div>

          <Link
            to="/hosts"
            className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-indigo-500 hover:text-indigo-600 hover:shadow-md md:inline-flex"
          >
            Show All Hosts
          </Link>
        </div>

        {/* Cards scrollable */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10" />

          <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 p-5">
            {displayedHosts.map((h, index) => (
              <Link
                key={h._id}
                to={`/host/${h._id}`}
                className="group relative flex w-64 shrink-0 snap-start flex-col rounded-3xl border border-slate-200 bg-white/80 p-5 text-left shadow-sm ring-1 ring-black/[0.02] transition-transform transition-shadow hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
              >
                {/* ⭐ Show the "Top Host" tag only for the first 4 */}
                {index < 4 && (
                  <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-600">
                    ⭐ Top Host
                  </span>
                )}

                <div className="mb-4">
                  <CardHost
                    _id={h._id}
                    firstName={h.firstName}
                    email={h.email}
                  />
                </div>

                <div className="mt-auto flex items-center justify-between pt-2 text-xs text-slate-400">
                  <span className="font-medium text-slate-500 group-hover:text-indigo-600">
                    View Profile
                  </span>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-[10px] transition group-hover:border-indigo-300 group-hover:text-indigo-600">
                    →
                  </span>
                </div>

                <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 opacity-0 blur-2xl transition group-hover:opacity-100 group-hover:from-indigo-500/10 group-hover:via-indigo-500/5 group-hover:to-indigo-500/0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopHosts;

import { UsersAPI, type User } from "@/library/usersMock";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const initials = (u: User) =>
  `${u.firstName?.[0] ?? ""}${u.lastName?.[0] ?? ""}`.toUpperCase();

const TopHosts = () => {
  const [displayedHosts, setDisplayedHosts] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const hosts = await UsersAPI.getTopHosts(6);
        setDisplayedHosts(hosts);
      } catch {
        setError("Error fetching top hosts");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div>Loading top hosts...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (displayedHosts.length === 0) {
    return <div>No top hosts found.</div>;
  }

  return (
    <section id="TopHosts" className="mx-auto max-w-6xl px-4 pt-20 pb-10">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-xl font-semibold">Top Hosts</h2>
        <a className="text-sm text-slate-600 hover:text-slate-900" href="#">
          See all
        </a>
      </div>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 justify-items-center">
        {displayedHosts.map((h) => (
          <Link
            key={h.id}
            to={`/host/${h.id}`}
            className="snap-start shrink-0 w-40 rounded-2xl border p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="mx-auto mb-2 grid h-16 w-16 place-items-center rounded-full border bg-slate-50 text-sm font-semibold">
              {h.pictureURL ? (
                <img
                  src={h.pictureURL}
                  alt={`${h.firstName}`}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <span>{initials(h)}</span>
              )}
            </div>
            <div className="text-sm font-medium">{h.firstName}</div>
            <div className="text-xs text-slate-500">
              {h.city}, {h.country}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TopHosts;

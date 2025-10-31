import { type User } from "@/library/usersMock";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers } from "@/data";
import CardHost from "./CardHost";

type HostSummary = {
  _id: string;
  firstName: string;
  email: string;
};
const initials = (u: User) =>
  `${u.firstName?.[0] ?? ""}${u.lastName?.[0] ?? ""}`.toUpperCase();

const TopHosts = () => {
  const [displayedHosts, setDisplayedHosts] = useState<HostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const dataUsers = await getUsers();
        // console.log(dataUsers);

        const filteredHost = dataUsers.users.filter((u: any) =>
          u.roles.includes("host")
        );

        // console.log(filteredHost);

        setDisplayedHosts(filteredHost);
      } catch {
        setError("Error fetching top hosts");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // console.log(displayedHosts);

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
    <section
      id="TopHosts"
      className="mx-auto max-w-full px-4 pt-20 pb-10 bg-white"
    >
      <div className="mb-4 flex items-end justify-between bg-white">
        <h2 className="text-xl font-semibold">Top Hosts</h2>
        <a className="text-sm text-slate-600 hover:text-slate-900" href="#">
          See all
        </a>
      </div>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 justify-items-center bg-white">
        {displayedHosts.map((h) => {
          return (
            <Link
              key={h._id}
              to={`/host/${h._id}`}
              className="snap-start shrink-0 w-40 rounded-2xl border p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardHost _id={h._id} firstName={h.firstName} email={h.email} />
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default TopHosts;

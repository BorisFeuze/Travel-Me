import { useMemo } from "react";
import { Link } from "react-router";
import { Users } from "@/library";
import type { User } from "@/library";

type CountriesProps = {
  hosts?: User[]; // optional pre-filtered hosts list
  limit?: number;
};

export default function Countries({ hosts, limit = 4 }: CountriesProps) {
  const base = hosts ?? Users;

  // compute [country, count] pairs, typed
  const countryCounts: Array<[string, number]> = useMemo(() => {
    const m = new Map<string, number>();
    for (const u of base) m.set(u.country, (m.get(u.country) ?? 0) + 1);
    return Array.from(m.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(0, limit);
  }, [base, limit]);

  return (
    <section id="countrylist" className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-xl font-semibold">Our Top Countries</h2>
        <Link
          className="text-sm text-slate-600 hover:text-slate-900"
          to="/countrylist"
        >
          See more
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {countryCounts.length === 0 ? (
          <div className="text-sm text-slate-500">No countries to display.</div>
        ) : (
          countryCounts.map(([country, count]: [string, number]) => (
            <Link
              key={country}
              to={`/countries/${encodeURIComponent(country)}`}
              className="rounded-2xl border p-4 text-left shadow-sm hover:bg-slate-50"
            >
              <div className="font-medium">{country}</div>
              <div className="text-xs text-slate-500">{count} hosts</div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

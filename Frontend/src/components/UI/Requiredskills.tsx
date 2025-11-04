import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAllJobOffers } from "@/data";

// 🧩 Icons
import type { LucideIcon } from "lucide-react";
import {
  Hammer,
  Building2,
  Utensils,
  Leaf,
  Sprout,
  Paintbrush,
  GraduationCap,
  Bed,
} from "lucide-react";

type SkillDef = { key: string; label: string; Icon: LucideIcon };

const SKILLS: SkillDef[] = [
  { key: "Renovation", label: "Renovation", Icon: Hammer },
  { key: "Building", label: "Building", Icon: Building2 },
  { key: "Cooking", label: "Cooking", Icon: Utensils },
  { key: "Gardening", label: "Gardening", Icon: Leaf },
  { key: "Farming", label: "Farming", Icon: Sprout },
  { key: "Painting", label: "Painting", Icon: Paintbrush },
  { key: "Teaching", label: "Teaching", Icon: GraduationCap },
  { key: "HostelWork", label: "Hostel Work", Icon: Bed },
];

const RequiredSkillsCompact = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await getAllJobOffers();
        setOffers(Array.isArray(res?.jobOffers) ? res.jobOffers : []);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Failed to load job offers.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const getCount = (skillKey: string) =>
    offers.filter((job) => {
      const needs = Array.isArray(job.needs) ? job.needs : [];
      return needs.includes(skillKey);
    }).length;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-20 bg-slate-100 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {SKILLS.map(({ key, label, Icon }) => {
        const count = getCount(key);
        const percent = count === 0 ? 15 : Math.min(90, 20 + count * 8);

        return (
          <Link
            key={key}
            to={`/skills/${key}`}
            className="
              flex flex-col gap-3
              rounded-2xl
              border border-slate-200
              bg-gradient-to-br from-slate-50 to-slate-100
              p-3
              shadow-[0_1px_0_0_rgba(0,0,0,0.03)]
              hover:shadow-md hover:border-slate-300
              transition
            "
          >
            <div className="flex items-center gap-3">
              {/* Icon tile */}
              <div
                className="
                  w-12 h-12 rounded-2xl
                  bg-white
                  border border-slate-200
                  flex items-center justify-center
                  shadow-sm
                "
                aria-hidden="true"
              >
                <Icon className="w-6 h-6 text-slate-800" />
              </div>

              {/* Title with background */}
              <div className="flex-1">
                <span
                  className="
                    inline-block
                    px-2 py-1
                    rounded-md
                    bg-slate-800/90
                    text-white
                    text-[12px] md:text-xs
                    font-semibold
                    leading-none
                    tracking-wide
                  "
                >
                  {label}
                </span>
                <p className="mt-1 text-xs text-slate-500">
                  {count} job{count === 1 ? "" : "s"} available
                </p>
              </div>

              <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-pink-100 text-pink-600 border border-pink-200">
                in demand
              </span>
            </div>

            {/* Progress */}
            <div className="space-y-1">
              <div className="flex items-center font-bold justify-between text-[12px] text-slate-600">
                <span>Match level</span>
                <span className="font-bold">{percent}%</span>
              </div>
              <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-pink-500 rounded-full transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            {/* CTA row */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-700 font-medium">
                View {label} jobs →
              </span>
              <span className="text-[11px] bg-slate-900 text-white px-2 py-1 rounded-full">
                {count || 0}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default RequiredSkillsCompact;

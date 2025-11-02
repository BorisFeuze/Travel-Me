import { useEffect, useState } from "react";
import { Link } from "react-router";
import { UsersAPI, type SkillsStat } from "@/library";

import renovation from "@/assets/images/skills/renovation.jpg";
import cooking from "@/assets/images/skills/cooking.jpg";
import gardening from "@/assets/images/skills/gardening.jpg";
import farming from "@/assets/images/skills/farming.jpg";
import painting from "@/assets/images/skills/painting.jpg";
import building from "@/assets/images/skills/building.jpg";
import teaching from "@/assets/images/skills/teaching.jpeg";
import hostelwork from "@/assets/images/skills/hostelwork.jpg";

const SKILLS = [
  { key: "Renovation", label: "Renovation", img: renovation },
  { key: "Building", label: "Building", img: building },
  { key: "Cooking", label: "Cooking", img: cooking },
  { key: "Gardening", label: "Gardening", img: gardening },
  { key: "Farming", label: "Farming", img: farming },
  { key: "Painting", label: "Painting", img: painting },
  { key: "Teaching", label: "Teaching", img: teaching },
  { key: "HostelWork", label: "Hostel Work", img: hostelwork },
];

const RequiredSkillsCompact = () => {
  const [skillsStats, setSkillsStats] = useState<SkillsStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const top = await UsersAPI.getSkillStats(8);
        setSkillsStats(Array.isArray(top) ? top : []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getCount = (skill: string) =>
    skillsStats.filter((s) => s.skill === skill).length;

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {SKILLS.map(({ key, label, img }) => {
        const count = getCount(key);
        // tanto per dare varietà alla barra
        const percent = count === 0 ? 15 : Math.min(90, 20 + count * 8);

        return (
          <Link
            key={key}
            to={`/skills/${key}`}
            className="
              flex flex-col gap-3
              bg-white
              border border-slate-100
              rounded-2xl
              p-3
              hover:border-slate-300 hover:shadow-md
              transition
            "
          >
            {/* top row */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
                <img
                  src={img}
                  alt={label}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 leading-tight">
                  {label}
                </p>
                <p className="text-xs text-slate-400">
                  {count} job{count === 1 ? "" : "s"} available
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-pink-100 text-pink-700">
                in demand
              </span>
            </div>

            {/* progress / metric */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Match level</span>
                <span>{percent}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pink-500 rounded-full transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            {/* footer */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
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

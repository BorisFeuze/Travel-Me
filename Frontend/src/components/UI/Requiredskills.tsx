import { useEffect, useState } from "react";
import { UsersAPI, type SkillsStat } from "@/library";
import Link from "@mui/material/Link";

import renovation from "@/assets/images/skills/renovation.jpg";
import baking from "@/assets/images/skills/baking.jpg";
import surfcoaching from "@/assets/images/skills/surfcoaching.jpg";
import cooking from "@/assets/images/skills/cooking.jpg";
import gardening from "@/assets/images/skills/gardening.jpg";
import farming from "@/assets/images/skills/farming.jpg";
import painting from "@/assets/images/skills/painting.jpg";
import building from "@/assets/images/skills/building.jpg";
import teaching from "@/assets/images/skills/teaching.jpeg";
import hostelwork from "@/assets/images/skills/hostelwork.jpg";

const skillBG: Record<string, string> = {
  Renovation: renovation,
  "Surf Coaching": surfcoaching,
  Building: building,
  Cooking: cooking,
  Gardening: gardening,
  Farming: farming,
  Painting: painting,
  Baking: baking,
  Teaching: teaching,
  HostelWork: hostelwork,
};

const RequiredSkills = () => {
  const [skills, setSkills] = useState<SkillsStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const top = await UsersAPI.getSkillStats(8);
        setSkills(top);
      } catch {
        setErr("Error fetching skill stats");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading required skills...</div>;

  return (
    <section id="RequiredSkills" className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-4xl font-extrabold leading-tight text-gray-800 mt-10">
          🛠️ Work recommendations for you
        </h1>
        <Link
          href="/"
          className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          See more →
        </Link>
      </div>

      {/* Karten – horizontales Scrollen */}
      <div className="flex gap-6 overflow-x-auto pb-10 scrollbar-hide">
        {skills.map((s) => {
          const img = skillBG[s.skill] ?? painting;
          return (
            <div
              key={s.skill}
              className="relative flex-shrink-0 w-64 h-72 rounded-2xl overflow-hidden group 
                         bg-gray-200 shadow-md hover:shadow-xl transform transition-transform duration-300 
                         hover:scale-105 cursor-pointer will-change-transform"
            >
              {/* Hintergrundbild (kein Zoom mehr!) */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${img})` }}
              />

              {/* Farbverlauf-Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Inhalt */}
              <div className="relative z-10 flex flex-col justify-end h-full p-5 text-white">
                <h2 className="text-2xl font-bold drop-shadow-lg">{s.skill}</h2>
              </div>

              {/* Glow beim Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl ring-2 ring-white/50" />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RequiredSkills;

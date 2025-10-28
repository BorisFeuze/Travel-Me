import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

const RequiredSkills = () => {
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

  if (loading) return <div>Loading skills...</div>;

  const getCount = (skill: string) =>
    skillsStats.filter((s) => s.skill === skill).length;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-8">
        🛠️ Work recommendations for you
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {SKILLS.map(({ key, label, img }) => (
          <Link
            key={key}
            to={`/skills/${key}`}
            className="relative h-64 rounded-2xl overflow-hidden hover:shadow-xl transform transition-transform duration-300 hover:scale-105"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${img})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative z-10 p-4 text-white font-bold text-xl">
              {label} ({getCount(key)})
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RequiredSkills;

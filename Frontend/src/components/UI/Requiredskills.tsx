import { useEffect, useState } from "react";
import { UsersAPI, type SkillsStat } from "@/library";
import Link from "@mui/material/Link";
import renovation from "@/assets/images/renovation.jpg";
import cooking from "@/assets/images/cooking.jpg";
import gardening from "@/assets/images/gardening.jpg";
import farming from "@/assets/images/farming.jpg";
import painting from "@/assets/images/painting.jpg";

const skillBG: Record<string, string> = {
  Renovation: renovation,
  Cooking: cooking,
  Gardening: gardening,
  Farming: farming,
  Painting: painting,
};

const Requiredskills = () => {
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

  if (loading) {
    return <div>Loading required skills...</div>;
  }

  if (err) {
    return <div>{err}</div>;
  }

  if (skills.length === 0) {
    return <div>No required skills found.</div>;
  }

  return (
    <section id="RequiredSkills" className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-xl font-semibold">Popular Required Works</h2>
        <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
          See more
        </Link>
      </div>

      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 justify-items-center">
        {skills.map((s) => (
          <div key={s.skill} className="card bg-base-100 w-96 shadow-sm">
            <figure>
              <img src={skillBG[s.skill]} alt={s.skill} />
            </figure>
            <div className="card-body">
              <h2 className="card-title">
                {s.skill}
                <div className="badge badge-secondary">{s.count} hosts</div>
              </h2>
              <div className="card-actions justify-end">
                {s.hostIds.map((id) => (
                  <div key={id} className="badge badge-outline">
                    {id}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Requiredskills;

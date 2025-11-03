import { useParams } from "react-router";
import { JobFilterCard } from "@/components/UI";

const DetailSkill = () => {
  const { skillName } = useParams<{ skillName: string }>();
  const skill = skillName || "";

  return (
    <section className="min-h-screen  px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900">
          🛠️ {skillName} – Job Opportunities
        </h1>
        <JobFilterCard initial={{ skills: skill ? [skill] : [] }} />
      </div>
    </section>
  );
};

export default DetailSkill;

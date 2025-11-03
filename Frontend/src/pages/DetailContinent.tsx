import { useParams } from "react-router";
import { JobFilterCard } from "@/components/UI";

const DetailContinent = () => {
  const { continentName } = useParams<{ continentName: string }>();

  return (
    <section className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900">
          🌍 {continentName} – Job Opportunities
        </h1>
        <JobFilterCard initial={{ continent: continentName }} />
      </div>
    </section>
  );
};

export default DetailContinent;

import { useState } from "react";
import ContinentCompact from "@/components/UI/Continents";
import RequiredSkillsCompact from "@/components/UI/Requiredskills";

const JobSectionsTabs = () => {
  // quale tab è attiva
  const [activeTab, setActiveTab] = useState<"continent" | "skills">(
    "continent"
  );

  return (
    <div className="px-5 pt-2 space-y-4 bg-white">
      {/* TAB HEADER */}
      <div className="flex gap-2  pb-2">
        <button
          onClick={() => setActiveTab("continent")}
          className={`px-4 py-1.5 rounded-full text-[1.5rem]  font-medium transition cursor-pointer
            ${
              activeTab === "continent"
                ? " text-slate-950"
                : "text-slate-300 hover:text-black"
            }
          `}
        >
          Job by continent
        </button>

        <button
          onClick={() => setActiveTab("skills")}
          className={`px-4 py-1.5 rounded-full text-[1.5rem]  font-medium transition cursor-pointer
            ${
              activeTab === "skills"
                ? " text-slate-950"
                : "text-slate-300 hover:text-black "
            }
          `}
        >
          Required skills
        </button>
      </div>

      {/* TAB CONTENT */}
      <div>
        {activeTab === "continent" ? (
          <ContinentCompact />
        ) : (
          <RequiredSkillsCompact />
        )}
      </div>
    </div>
  );
};

export default JobSectionsTabs;

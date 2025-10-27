import { useEffect, useState } from "react";
import { getAllJobOffers } from "@/data"; // <- deve chiamare GET /jobOffers
import { Calendar02 } from "@/components/UI/Calendar02";
import { MessageSquare } from "lucide-react";

const JobOffersList = () => {
  const [jobs, setJobs] = useState<JobFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const jobs = async () => {
      try {
        setLoading(true);
        const res = await getAllJobOffers();

        console.log(res);
        setJobs(res.jobOffers);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Failed to load job offers.");
      } finally {
        setLoading(false);
      }
    };
    jobs();
  }, []);

  if (loading)
    return (
      <p className="text-center p-10 text-gray-500">Loading job offers...</p>
    );
  if (error) return <p className="text-center p-10 text-red-500">{error}</p>;
  if (!jobs.length)
    return (
      <p className="text-center p-10 text-gray-500">No job offers found.</p>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Offers</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <article
              key={job._id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition"
            >
              {/* Cover */}
              {job.pictureURL?.length ? (
                <img
                  src={
                    typeof job.pictureURL[0] === "string"
                      ? job.pictureURL[0]
                      : URL.createObjectURL(job.pictureURL[0])
                  }
                  alt={job.title}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="h-40 w-full bg-gray-200" />
              )}

              {/* Body */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {job.title}
                </h2>
                <p className="text-sm text-gray-500 mb-3">{job.location}</p>

                {/* Needs */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {(job.needs || []).slice(0, 4).map((need, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-xs font-medium"
                    >
                      {need}
                    </span>
                  ))}
                  {job.needs?.length > 4 && (
                    <span className="text-xs text-gray-500">
                      +{job.needs.length - 4}
                    </span>
                  )}
                </div>

                {/* Languages */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {(job.languages || []).slice(0, 3).map((lang, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => console.log("open details", job._id)}
                    className="text-sm px-3 py-1.5 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                  >
                    Details
                  </button>
                  <button
                    onClick={() =>
                      console.log(
                        "Navigate to chat with host",
                        job.userProfileId
                      )
                    }
                    className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Contact
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobOffersList;

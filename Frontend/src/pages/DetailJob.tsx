import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobOffers } from "@/data";
import { useAuth } from "@/context";

const DetailJob = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [job, setJob] = useState<JobFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!user?._id || !id) return;

      try {
        setLoading(true);
        const response = await getJobOffers(user._id);
        if (!response) throw new Error("No job offers found");

        // Zugriff auf das Array jobOffers
        const jobData = response.jobOffers.find((j: JobFormData) => j._id === id);
        if (!jobData) {
          setError("Job offer not found.");
          return;
        }

        setJob(jobData);
      } catch (err) {
        console.error(err);
        setError("Failed to load job offer.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [user, id]);


  if (loading) return <p>Loading job offer...</p>;
  if (error) return <p>{error}</p>;
  if (!job) return <p>Job offer not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <p className="text-gray-600 mb-2"><strong>Location:</strong> {job.location}</p>
      <p className="text-gray-600 mb-2"><strong>Posted by:</strong> {job.userProfileId}</p>

      {job.pictureURL.length > 0 && (
        <div className="flex gap-4 overflow-x-auto mb-4">
          {job.pictureURL.map((file, index) => (
            <img
              key={index}
              src={typeof file === "string" ? file : URL.createObjectURL(file)}
              alt={`Job ${index}`}
              className="h-48 rounded"
            />
          ))}
        </div>
      )}

      <p className="mb-4">{job.description}</p>

      <div className="mb-2">
        <strong>Needs:</strong> {job.needs.length ? job.needs.join(", ") : "None"}
      </div>

      <div className="mb-2">
        <strong>Languages:</strong> {job.languages.length ? job.languages.join(", ") : "None"}
      </div>
    </div>
  );
};

export default DetailJob;

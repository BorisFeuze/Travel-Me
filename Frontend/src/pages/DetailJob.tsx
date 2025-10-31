import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobOfferById, getSingleUserProfile } from "@/data";
import { Calendar02 } from "@/components/UI/Calendar02";
import { ArrowLeft, ArrowRight, MessageSquare } from "lucide-react";
import { useAuth } from "@/context";

const DetailJob = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth?.() ?? { user: null };
  const [job, setJob] = useState<JobData | null>(null);
  const [hostProfile, setHostProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const run = async () => {
      if (!id) {
        setError("Invalid job id.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await getJobOfferById(id);
        const jobData: JobData = res?.jobOffer ?? null;
        if (!jobData) {
          setError("Job offer not found.");
          return;
        }
        console.log(jobData);
        setJob(jobData);

        if (!jobData.userProfileId) {
          setError("userProfileId not found.");
          return;
        }

        console.log(jobData.userProfileId);
        const hostData = await getSingleUserProfile(jobData.userProfileId);

        console.log(hostData);

        setHostProfile(hostData.userProfile);

        if (!hostData.userProfile.userId) {
          setError("userId not found.");
          return;
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.error(e);
          setError(e.message);
        } else {
          console.error(e);
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const nextImage = () => {
    if (!job?.pictureURL?.length) return;
    setCurrentImage((prev) => (prev + 1) % job.pictureURL.length);
  };

  const prevImage = () => {
    if (!job?.pictureURL?.length) return;
    setCurrentImage((prev) =>
      prev === 0 ? job.pictureURL.length - 1 : prev - 1
    );
  };

  if (loading)
    return (
      <p className="text-center p-10 text-gray-500">Loading job offer...</p>
    );
  if (error) return <p className="text-center p-10 text-red-500">{error}</p>;
  if (!job)
    return (
      <p className="text-center p-10 text-gray-500">Job offer not found.</p>
    );

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-purple-50 p-10 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-10 ">
        {/* TITLE + HOST */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-extrabold leading-relaxed text-gray-900 text-left">
              {job.title}
            </h1>
            <p className="text-gray-600 mt-1 text-left">
              {[job.continent, job.country, job.location]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 cursor-pointer transition-transform duration-300 hover:scale-105 mt-2"
              onClick={() =>
                navigate(
                  `/host/${(hostProfile?.userId as unknown as { _id: string })?._id}`
                )
              }
              title="Go to host profile"
            >
              {hostProfile?.pictureURL ? (
                <img
                  src={hostProfile.pictureURL as string}
                  alt="Host"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
            <div>
              <h3 className="text-gray-600 text-sm text-center">
                {hostProfile
                  ? `${(hostProfile.userId as unknown as { firstName: string })?.firstName ?? ""} ${(hostProfile.userId as unknown as { lastName: string })?.lastName ?? ""}`.trim()
                  : "Host"}
              </h3>
            </div>
          </div>
        </div>

        {/* IMAGE GALLERY */}
        {job.pictureURL.length > 0 && (
          <div className="relative flex justify-center items-center mt-6">
            {/* LEFT BUTTON */}
            <button
              onClick={prevImage}
              className="absolute left-0 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition z-10"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <div className="overflow-hidden rounded-3xl shadow-xl transition-transform duration-500 hover:scale-105">
              <img
                src={
                  typeof job.pictureURL[currentImage] === "string"
                    ? (job.pictureURL[currentImage] as string)
                    : URL.createObjectURL(job.pictureURL[currentImage] as File)
                }
                alt="Job"
                className="h-160 w-auto object-cover"
              />
            </div>

            <button
              onClick={nextImage}
              className="absolute right-0 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition z-10"
              aria-label="Next image"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}
        <div className="flex justify-end  mt-6">
          <button
            onClick={() => (user ? navigate(`/chat`) : navigate(`/login`))}
            className="flex items-center gap-2 bg-linear-to-r border border-blue-600 cursor-pointer bg-blue-600 hover:bg-white hover:text-blue-700 hover:border-blue text-white px-5 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
          >
            <MessageSquare className="w-5 h-5" />
            {user ? "Contact" : "Login to contact"}
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-left">
            Description
          </h2>
          <p className="text-gray-600 leading-relaxed">{job.description}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-left">
            Needs
          </h2>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(job.needs) && job.needs.length > 0 ? (
              job.needs.map((need, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium shadow-sm"
                >
                  {need}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No needs specified.</p>
            )}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-left">
            Languages
          </h2>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(job.languages) && job.languages.length > 0 ? (
              job.languages.map((lang, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium shadow-sm"
                >
                  {lang}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No languages listed.</p>
            )}
          </div>
        </div>

        {Array.isArray(job.availability) && job.availability.length > 0 && (
          <div className="mb-15">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Availability
            </h2>
            <div className="flex justify-center">
              <div className="[&_.rdp-day]:pointer-events-none bg-purple-50 rounded-2xl shadow-lg p-6">
                <Calendar02
                  multiRange={true}
                  selectedRanges={job.availability}
                />
                <div className="mt-4 space-y-2">
                  {job.availability.map((range, index) => (
                    <p key={index} className="text-gray-600 text-center">
                      <span className="font-semibold">From:</span>{" "}
                      <span className="font-medium">
                        {new Date(range.from).toLocaleDateString()}
                      </span>
                      {" to "}
                      <span className="font-medium">
                        {new Date(range.to).toLocaleDateString()}
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOOK */}
        <div className="flex justify-center">
          <button
            onClick={() =>
              user
                ? navigate(`/book/${job._id}`)
                : navigate(`/login?redirect=/book/${job._id}`)
            }
            className="bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold px-10 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailJob;

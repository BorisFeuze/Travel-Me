import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobOffers, getUserDetails } from "@/data";
import { useAuth } from "@/context";
import { Calendar02 } from "@/components/UI/Calendar02";
import { ArrowLeft, ArrowRight, MessageSquare } from "lucide-react";

const DetailJob = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [job, setJob] = useState<JobFormData | null>(null);
  const [host, setHost] = useState<UserProfileFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchJob = async () => {
      if (!user?._id || !id) return;

      try {
        setLoading(true);
        const response = await getJobOffers(user._id);
        if (!response?.jobOffers) throw new Error("No job offers found");

        const jobData = response.jobOffers.find((j: JobFormData) => j._id === id);
        if (!jobData) {
          setError("Job offer not found.");
          return;
        }

        setJob(jobData);

        // Host info laden
        const hostData = await getUserDetails(jobData.userProfileId);
        setHost(hostData?.userProfiles?.[0] || null);
      } catch (err) {
        console.error(err);
        setError("Failed to load job offer.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [user, id]);

  if (loading) return <p className="text-center p-10 text-gray-500">Loading job offer...</p>;
  if (error) return <p className="text-center p-10 text-red-500">{error}</p>;
  if (!job) return <p className="text-center p-10 text-gray-500">Job offer not found.</p>;

  const nextImage = () => {
    if (!job.pictureURL.length) return;
    setCurrentImage((prev) => (prev + 1) % job.pictureURL.length);
  };

  const prevImage = () => {
    if (!job.pictureURL.length) return;
    setCurrentImage((prev) => (prev === 0 ? job.pictureURL.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-10 flex justify-center">
  <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-10 ">

    {/* TITLE + HOST SECTION */}
<div className="flex justify-between items-start">
  {/* TITLE */}
  <div>
    <h1 className="text-4xl font-extrabold leading-relaxed text-gray-900 text-left">
      {job.title}
    </h1>
    <p className="text-gray-600 mt-1 text-left">{job.location}</p>
  </div>

  {/* HOST SECTION */}
  <div className="flex flex-col items-center gap-2">
    <div
      className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 cursor-pointer transition-transform duration-300 hover:scale-105 mt-2"
      onClick={() => console.log("Navigate to host profile")}
    >
      <img
        src={host?.pictureURL?.[0]}
        alt="Host"
        className="object-cover w-full h-full"
      />
    </div>
    <div>
      <h3 className="text-gray-600 text-sm text-center">
        {host ? `${user.firstName} ${user.lastName}` : "Host Name"}
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

        {/* IMAGE */}
        <div className="overflow-hidden rounded-3xl shadow-xl transition-transform duration-500 hover:scale-105">
          <img
            src={
              typeof job.pictureURL[currentImage] === "string"
                ? job.pictureURL[currentImage]
                : URL.createObjectURL(job.pictureURL[currentImage])
            }
            alt="Job Image"
            className="h-[40rem] w-auto object-cover"
          />
        </div>

        {/* RIGHT BUTTON */}
        <button
          onClick={nextImage}
          className="absolute right-0 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition z-10"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    )}

    {/* CONTACT BUTTON */}
    {user && (
      <div className="flex justify-end mt-6">
        <button
          onClick={() => console.log("Navigate to chat")}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
        >
          <MessageSquare className="w-5 h-5" />
          Contact
        </button>
      </div>
    )}

    {/* DESCRIPTION */}
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-left">Description</h2>
      <p className="text-gray-600 leading-relaxed">{job.description}</p>
    </div>

    {/* NEEDS */}
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-left">Needs</h2>
      <div className="flex flex-wrap gap-2">
        {job.needs.length > 0 ? (
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

    {/* LANGUAGES */}
    <div className="mb-20">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-left">Languages</h2>
      <div className="flex flex-wrap gap-2">
        {job.languages.length > 0 ? (
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

    {/* AVAILABILITY CALENDAR */}
    <div className="mb-15">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Availability
      </h2>
      <div className="flex justify-center">
        <div className="bg-purple-50 rounded-2xl shadow-lg p-6">
          <Calendar02 />
        </div>
      </div>
    </div>

    {/* BOOK BUTTON */}
    <div className="flex justify-center">
      <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-10 py-3 rounded-full shadow-lg hover:scale-105 transition-transform">
        Book
      </button>
    </div>

  </div>
</div>

  );
};

export default DetailJob;

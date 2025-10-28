import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobOffers } from "@/data";
import { useAuth } from "@/context";
import { Calendar02 } from "@/components/UI/Calendar02";

const EditJob = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [job, setJob] = useState<JobFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [previewUrls, setPreviewUrls] = useState<(string | File)[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [availability, setAvailability] = useState<{ from: Date; to: Date }[]>([]);

useEffect(() => {
  if (job?.availability) {
    const ranges = job.availability.map((r: any) => ({
      from: new Date(r.from),
      to: new Date(r.to),
    }));
    setAvailability(ranges);
  }
}, [job]);


  useEffect(() => {
    const fetchJob = async () => {
      if (!user?._id || !id) return;

      try {
        setLoading(true);
        const response = await getJobOffers(user._id);
        if (!response?.jobOffers || response.jobOffers.length === 0) {
          setError("No job offers found.");
          return;
        }
        const jobData = response.jobOffers.find((j: JobFormData) => j._id === id);
        if (!jobData) {
          setError("Job offer not found.");
          return;
        }
        setJob(jobData);
        setPreviewUrls(jobData.pictureURL || []);
      } catch (err) {
        setError("Failed to load job offers.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [user, id]);

  // Handle image navigation
  const prevImage = () => setCurrentImage((prev) => (prev === 0 ? previewUrls.length - 1 : prev - 1));
  const nextImage = () => setCurrentImage((prev) => (prev === previewUrls.length - 1 ? 0 : prev + 1));

  // Handle image upload
  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;
  const filesArray = Array.from(e.target.files);
  setPreviewUrls((prev) => [...prev, ...filesArray]);
};

  // Remove image
  const handleRemoveImage = (index: number) => {
  setPreviewUrls((prev) => prev.filter((_, idx) => idx !== index));
  // currentImage anpassen, falls das aktuelle Bild gelöscht wird
  if (currentImage === index && previewUrls.length > 1) {
    setCurrentImage(0);
  }
  };

  // Handle form input
  const handleInputChange = (field: keyof JobFormData, value: any) => {
    setJob((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simuliere Save-Request
      console.log("Saving job...", job);
      setSaveMessage({ type: "success", text: "Job offer updated successfully!" });
    } catch {
      setSaveMessage({ type: "error", text: "Failed to save job offer." });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <p className="text-center p-10 text-gray-500">Loading job offer...</p>;
  if (error) return <p className="text-center p-10 text-red-500">{error}</p>;
  if (!job) return <p className="text-center p-10 text-gray-500">Job offer not found.</p>;

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-purple-50 p-6 flex flex-col lg:flex-row gap-8">

      {/* IMAGE GALLERY */}
      <div className="w-full lg:w-1/3 flex flex-col items-center">
  <div className="w-full bg-white shadow-2xl rounded-2xl p-4 flex flex-col items-center justify-between" style={{ minHeight: "600px" }}>
    <div className="relative w-full h-80 bg-white rounded-xl overflow-hidden flex items-center justify-center">
      {previewUrls.length > 0 ? (
        <>
          <img
            src={
              typeof previewUrls[currentImage] === "string"
                ? previewUrls[currentImage]
                : URL.createObjectURL(previewUrls[currentImage])
            }
            alt="Job Image"
            className="h-[40rem] w-auto object-cover"
          />
          <button onClick={prevImage} className="absolute left-2 bg-white/70 hover:scale-110 transition p-2 rounded-full shadow">◀</button>
          <button onClick={nextImage} className="absolute right-2 bg-white/70 hover:scale-110 transition p-2 rounded-full shadow">▶</button>
        </>
      ) : (
        <div className="text-gray-500 text-center">No images added</div>
      )}
    </div>

    {previewUrls.length > 0 && (
      <div className="flex gap-2 mt-4 flex-wrap justify-center">
        {previewUrls.map((url, idx) => (
          <div key={idx} className="relative group">
            <img
              src={typeof url === "string" ? url : URL.createObjectURL(url)}
              alt={`Thumb ${idx}`}
              className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${currentImage === idx ? "border-black" : "border-transparent"}`}
              onClick={() => setCurrentImage(idx)}
            />
            <button onClick={() => handleRemoveImage(idx)} className="absolute top-0 right-0 bg-black text-white rounded-full text-xs px-1 opacity-0 group-hover:opacity-100 transition">✕</button>
          </div>
        ))}
      </div>
    )}

    <label className="btn bg-black text-white border-none hover:shadow-lg transition w-40 mt-6">
      Add Pictures
      <input type="file" multiple accept="image/*" className="hidden" onChange={handlePictureUpload} />
    </label>
  </div>
</div>


      {/* FORM */}
      <div className="w-full lg:w-2/3">
        <div className="card bg-white shadow-2xl rounded-2xl p-6 pb-3" style={{ minHeight: "600px" }}>
          <h2 className="text-3xl mb-6 font-bold text-black">Update Job Offer</h2>

          {/* title */}
          <label className="label">
            <span className="label-text font-medium text-gray-700">Title</span>
          </label>
          <input type="text" className="input input-bordered w-full mb-4 shadow-sm focus:ring-2 focus:ring-gray-400 transition"
            value={job.title} onChange={(e) => handleInputChange("title", e.target.value)} />

          {/* continent */}
          <label className="label">
            <span className="label-text font-medium text-gray-700">Continent</span>
          </label>
          <input type="text" className="input input-bordered w-full mb-4 shadow-sm focus:ring-2 focus:ring-gray-400 transition"
            value={job.continent} onChange={(e) => handleInputChange("continent", e.target.value)} />

          {/* country */}
          <label className="label">
            <span className="label-text font-medium text-gray-700">Country</span>
          </label>
          <input type="text" className="input input-bordered w-full mb-4 shadow-sm focus:ring-2 focus:ring-gray-400 transition"
            value={job.country} onChange={(e) => handleInputChange("country", e.target.value)} />

          {/* location */}
          <label className="label">
            <span className="label-text font-medium text-gray-700">Location</span>
          </label>
          <input type="text" className="input input-bordered w-full mb-4 shadow-sm focus:ring-2 focus:ring-gray-400 transition"
            value={job.location} onChange={(e) => handleInputChange("location", e.target.value)} />

          {/* description */}
          <label className="label">
            <span className="label-text font-medium text-gray-700">Description</span>
          </label>
          <textarea className="textarea textarea-bordered w-full mb-4 shadow-sm focus:ring-2 focus:ring-gray-400 transition"
            value={job.description} onChange={(e) => handleInputChange("description", e.target.value)} />

       <div>
  <label className="label mt-4">
    <span className="label-text font-medium text-gray-700">Availability</span>
  </label>

  <Calendar02
    multiRange
    selectedRanges={availability}
    onSelectDates={(dates) => {
      // Neue Ranges hinzufügen, ohne alte zu überschreiben
      const newAvailability = [...availability, ...dates];
      setAvailability(newAvailability);
      handleInputChange("availability", newAvailability);
    }}
  />

  {availability.length > 0 && (
    <div className="mt-4 space-y-2 flex flex-col items-center">
      {availability.map((range, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span className="text-gray-600 text-center">
            <span className="font-semibold">From:</span>{" "}
            <span className="font-medium">{range.from.toLocaleDateString()}</span>
            {" to "}
            <span className="font-medium">{range.to.toLocaleDateString()}</span>
          </span>
          <button
            onClick={() => {
              const newAvailability = availability.filter((_, i) => i !== idx);
              setAvailability(newAvailability);
              handleInputChange("availability", newAvailability); // Job State aktualisieren
            }}
            className="text-red-500 font-bold px-2 py-1 rounded hover:bg-red-100 transition"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )}
</div>


          {/* save button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn bg-black text-white mt-6 w-full"
          >
            {isSaving ? "Saving..." : "Update Job Offer"}
          </button>

          {/* save message */}
          {saveMessage && (
            <p className={`mt-4 font-medium ${saveMessage.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {saveMessage.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditJob;

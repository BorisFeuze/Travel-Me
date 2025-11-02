import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getJobOffers, updateJobOffers, deleteJobOffer } from "@/data";
import { useAuth, useUser } from "@/context";
import { Calendar02 } from "@/components/UI/Calendar02";
import { toast } from "react-toastify";

const EditJob = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [job, setJob] = useState<JobFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [previewUrls, setPreviewUrls] = useState<(string | File)[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [availability, setAvailability] = useState<{ from: Date; to: Date }[]>(
    []
  );

  const { getUserProfile } = useUser();

  const dropdownRefs = useRef<Array<HTMLDetailsElement | null>>([]);

  const needsOptions = [
    "Cooking",
    "Teaching",
    "Building",
    "Gardening",
    "First Aid",
  ];
  const languageOptions = [
    "English",
    "Spanish",
    "German",
    "French",
    "Portuguese",
  ];

  const toggleSelection = (field: "needs" | "languages", value: string) => {
    setJob((prev) => {
      if (!prev) return prev;
      const list = prev[field] || [];
      return {
        ...prev,
        [field]: list.includes(value)
          ? list.filter((v) => v !== value)
          : [...list, value],
      };
    });
  };

  const handleDropdownToggle = (index: number) => {
    dropdownRefs.current.forEach(
      (ref, i) => i !== index && ref?.removeAttribute("open")
    );
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRefs.current.every(
          (ref) => ref && !ref.contains(e.target as Node)
        )
      ) {
        dropdownRefs.current.forEach((ref) => ref?.removeAttribute("open"));
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (job?.availability) {
      const ranges = job.availability.map(
        (r: { from: string | Date; to: string | Date }) => ({
          from: new Date(r.from),
          to: new Date(r.to),
        })
      );
      setAvailability(ranges);
    }
  }, [job]);

  useEffect(() => {
    const fetchJob = async () => {
      if (!user?._id || !id) return;
      try {
        setLoading(true);
        const profile = await getUserProfile(user?._id ?? "");
        if (!profile) {
          setError("User profile not found.");
          setLoading(false);
          return;
        }

        if (!profile?.userProfiles[0]) {
          console.error("please created a account");
        }
        const response = await getJobOffers(
          profile?.userProfiles[0]._id as string
        );
        if (!response?.jobOffers || response.jobOffers.length === 0) {
          setError("No job offers found.");
          return;
        }
        const jobData = response.jobOffers.find((j: JobData) => j._id === id);
        if (!jobData) {
          setError("Job offer not found.");
          return;
        }
        setJob(jobData);
        setPreviewUrls(jobData.pictureURL || []);
      } catch {
        setError("Failed to load job offers.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [user, id, getUserProfile]);

  const prevImage = () =>
    setCurrentImage((prev) => (prev === 0 ? previewUrls.length - 1 : prev - 1));
  const nextImage = () =>
    setCurrentImage((prev) => (prev === previewUrls.length - 1 ? 0 : prev + 1));

  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setPreviewUrls((prev) => [...prev, ...filesArray]);
  };

  const handleRemoveImage = (index: number) => {
    setPreviewUrls((prev) => prev.filter((_, idx) => idx !== index));
    if (currentImage === index && previewUrls.length > 1) setCurrentImage(0);
  };

  const handleInputChange = <K extends keyof JobFormData>(
    field: K,
    value: JobFormData[K]
  ) => {
    setJob((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!job || !user?._id || !id) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      // cange availability in ISO-Strings
      const availabilityParsed = availability.map((r) => ({
        from: r.from.toISOString(),
        to: r.to.toISOString(),
      }));

      // create formdata
      const data = new FormData();

      // single values
      data.append("title", job.title);
      data.append("continent", job.continent);
      data.append("country", job.country);
      data.append("location", job.location);
      data.append("description", job.description);
      data.append("userProfileId", job.userProfileId);
      (job.needs || []).forEach((need) => data.append("needs", need));
      (job.languages || []).forEach((lang) => data.append("languages", lang));
      data.append("availability", JSON.stringify(availabilityParsed));

      const existingUrls = previewUrls.filter(
        (url) => typeof url === "string"
      ) as string[];

      const newFiles = previewUrls.filter(
        (url) => url instanceof File
      ) as File[];

      // Sende bestehende URLs als JSON-String
      if (existingUrls.length > 0) {
        existingUrls.forEach((url) => {
          data.append("existingPictureURLs", url);
        });
      }

      // Sende neue Files als Files
      newFiles.forEach((file) => {
        data.append("newPictures", file);
      });

      // update request to the backend
      const result = await updateJobOffers(id, data);
      console.log("Job offer updated:", result);

      setSaveMessage({
        type: "success",
        text: "Job offer updated successfully!",
      });

      // load job data new
      const updatedResponse = await getJobOffers(user._id);

      const updatedJob = updatedResponse?.jobOffers?.find(
        (j: JobData) => j._id === id
      );
      if (updatedJob) {
        setJob(updatedJob);
        setPreviewUrls(updatedJob.pictureURL || []);
      }
      toast.success("Your Jod Offer is successfully updated");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error updating job offer!";
      toast.error(errorMessage);
      console.error("Error updating job offer:", error);
      setSaveMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to update job offer. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await deleteJobOffer(id);
      setSaveMessage({ type: "success", text: "Job offer got deleted!" });
      setJob(null);
      setPreviewUrls([]);
      toast.success("The Jod Offer is deleted");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error deleting job offer!";
      toast.error(errorMessage);
      console.error("Error deleting job offer:", error);
      setSaveMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to delete job offer.",
      });
    } finally {
      setIsSaving(false);
    }
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
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-purple-50 p-6 flex flex-col lg:flex-row gap-8">
      {/* IMAGE GALLERY */}
      <div className="w-full lg:w-1/3 flex flex-col items-center">
        <div
          className="w-full bg-white shadow-2xl rounded-2xl p-4 flex flex-col items-center justify-between"
          style={{ minHeight: "600px" }}
        >
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
                  className="h-160 w-auto object-cover"
                />
                <button
                  onClick={prevImage}
                  className="absolute left-2 bg-white/70 hover:scale-110 transition p-2 rounded-full shadow"
                >
                  ◀
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 bg-white/70 hover:scale-110 transition p-2 rounded-full shadow"
                >
                  ▶
                </button>
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
                    src={
                      typeof url === "string" ? url : URL.createObjectURL(url)
                    }
                    alt={`Thumb ${idx}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${
                      currentImage === idx
                        ? "border-black"
                        : "border-transparent"
                    }`}
                    onClick={() => setCurrentImage(idx)}
                  />
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-0 right-0 bg-black text-white rounded-full text-xs px-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="btn bg-black text-white border-none hover:shadow-lg transition w-40 mt-6">
            Add Pictures
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handlePictureUpload}
            />
          </label>
        </div>
      </div>

      {/* FORM */}
      <div className="w-full lg:w-2/3">
        <div
          className="card bg-white shadow-2xl rounded-2xl p-6 pb-3"
          style={{ minHeight: "600px" }}
        >
          {/* HEADER mit Delete-Button */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-3xl font-bold text-black">Update Job Offer</h2>
            <button
              onClick={handleDelete}
              disabled={isSaving}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>

          {/* BASIC FIELDS */}
          {["title", "continent", "country", "location"].map((field) => (
            <div key={field}>
              <label className="label">
                <span className="label-text font-medium text-gray-700 capitalize">
                  {field}
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full mb-4 shadow-sm focus:ring-2 focus:ring-gray-400 transition"
                value={job[field as keyof JobFormData] as string}
                onChange={(e) =>
                  handleInputChange(field as keyof JobFormData, e.target.value)
                }
              />
            </div>
          ))}

          {/* DESCRIPTION */}
          <label className="label">
            <span className="label-text font-medium text-gray-700">
              Description
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full mb-4 shadow-sm focus:ring-2 focus:ring-gray-400 transition"
            value={job.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />

          {/* NEEDS */}
          <label className="label">
            <span className="label-text font-medium text-gray-700">Needs</span>
          </label>
          <div className="relative mb-4">
            <details
              ref={(el) => {
                dropdownRefs.current[0] = el;
              }}
              className="dropdown dropdown-top w-full"
              onClick={() => handleDropdownToggle(0)}
            >
              <summary className="select select-bordered w-full shadow-sm focus:ring-2 focus:ring-gray-400 transition cursor-pointer flex items-center justify-between">
                <span className="flex-1 text-left">
                  {job.needs.length > 0 ? job.needs.join(", ") : "Select needs"}
                </span>
              </summary>
              <ul className="dropdown-content menu p-2 shadow bg-gray-100 rounded-box w-full z-10 max-h-60 overflow-y-auto">
                {needsOptions.map((need) => (
                  <li key={need}>
                    <label className="cursor-pointer flex items-center justify-between hover:bg-base-200 px-3 py-2">
                      <span className="flex-1">{need}</span>
                      {job.needs.includes(need) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <input
                        type="checkbox"
                        checked={job.needs.includes(need)}
                        onChange={() => toggleSelection("needs", need)}
                        className="hidden"
                      />
                    </label>
                  </li>
                ))}
              </ul>
            </details>
          </div>

          {/* LANGUAGES */}
          <label className="label">
            <span className="label-text font-medium text-gray-700">
              Languages
            </span>
          </label>
          <div className="relative mb-6">
            <details
              ref={(el) => {
                dropdownRefs.current[1] = el;
              }}
              className="dropdown dropdown-top w-full"
              onClick={() => handleDropdownToggle(1)}
            >
              <summary className="select select-bordered w-full shadow-sm focus:ring-2 focus:ring-gray-400 transition cursor-pointer flex items-center justify-between">
                <span className="flex-1 text-left">
                  {job.languages.length > 0
                    ? job.languages.join(", ")
                    : "Select languages"}
                </span>
              </summary>
              <ul className="dropdown-content menu p-2 shadow bg-gray-100 rounded-box w-full z-10 max-h-60 overflow-y-auto">
                {languageOptions.map((lang) => (
                  <li key={lang}>
                    <label className="cursor-pointer flex items-center justify-between hover:bg-base-200 px-3 py-2">
                      <span className="flex-1">{lang}</span>
                      {job.languages.includes(lang) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <input
                        type="checkbox"
                        checked={job.languages.includes(lang)}
                        onChange={() => toggleSelection("languages", lang)}
                        className="hidden"
                      />
                    </label>
                  </li>
                ))}
              </ul>
            </details>
          </div>

          {/* AVAILABILITY */}
          <div>
            <label className="label mt-4">
              <span className="label-text font-medium text-gray-700">
                Availability
              </span>
            </label>

            <Calendar02
              multiRange
              selectedRanges={availability}
              onMultiRangeSelect={(ranges) => {
                const validRanges = ranges.filter(
                  (r): r is { from: Date; to: Date } => !!r.from && !!r.to
                );
                setAvailability(validRanges);
                handleInputChange("availability", validRanges);
              }}
            />

            {availability.length > 0 && (
              <div className="mt-4 space-y-2">
                {availability.map((range, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <p className="text-gray-700">
                      <span className="font-semibold">From:</span>{" "}
                      <span className="font-medium">
                        {range.from.toLocaleDateString()}
                      </span>
                      {" to "}
                      <span className="font-medium">
                        {range.to.toLocaleDateString()}
                      </span>
                    </p>
                    <button
                      onClick={() => {
                        const newRanges = availability.filter(
                          (_, i) => i !== idx
                        );
                        setAvailability(newRanges);
                        handleInputChange("availability", newRanges);
                      }}
                      className="text-red-600 hover:text-red-800 font-bold text-xl px-2 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn bg-black text-white mt-6 w-full"
          >
            {isSaving ? "Saving..." : "Update Job Offer"}
          </button>

          {/* MESSAGE */}
          {saveMessage && (
            <p
              className={`mt-4 font-medium ${
                saveMessage.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {saveMessage.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditJob;

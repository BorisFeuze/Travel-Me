import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { addJobOffers } from "@/data/jobOffers";
import { useAuth, useUser } from "@/context";
import { Calendar02 } from "@/components/UI/Calendar02";
import { type DateRange } from "react-day-picker";

const CreateJob = () => {
  const { user } = useAuth();
  const { getUserProfile } = useUser();
  const [profile, setProfile] = useState();

  useEffect(() => {
    (async () => {
      try {
        const profile: UserProfileData = await getUserProfile(user?._id ?? "");
        console.log(profile);

        if (!profile.userProfiles[0]) {
          console.error("please created a account");
        }
        setProfile(profile.userProfiles[0]._id);
      } catch (error) {}
    })();
  }, []);

  console.log(profile);

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    continent: "",
    country: "",
    location: "",
    userProfileId: "",
    pictureURL: [],
    description: "",
    needs: [],
    languages: [],
    availability: [] as DateRange[],
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

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

  // input handling
  const handleInputChange = <K extends keyof JobFormData>(
    field: K,
    value: JobFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Picture upload
  const handlePictureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    setFormData((prev) => ({
      ...prev,
      pictureURL: [...prev.pictureURL, ...files],
    }));

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setPreviewUrls((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      pictureURL: prev.pictureURL.filter((_, i) => i !== index),
    }));
    if (currentIndex >= previewUrls.length - 1 && currentIndex > 0)
      setCurrentIndex(currentIndex - 1);
  };

  const nextImage = () =>
    setCurrentIndex((prev) =>
      previewUrls.length > 1 ? (prev + 1) % previewUrls.length : prev
    );
  const prevImage = () =>
    setCurrentIndex((prev) =>
      previewUrls.length > 1
        ? prev === 0
          ? previewUrls.length - 1
          : prev - 1
        : prev
    );

  // for dropdown menu
  const toggleSelection = (field: "needs" | "languages", value: string) => {
    setFormData((prev) => {
      const list = prev[field];
      return list.includes(value)
        ? { ...prev, [field]: list.filter((v) => v !== value) }
        : { ...prev, [field]: [...list, value] };
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

  // Save the job offer
  const handleSave = async () => {
    if (!formData.location || !formData.description) {
      setSaveMessage({
        text: "Please fill all required fields.",
        type: "error",
      });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    formData.userProfileId = profile;

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("userProfileId", formData.userProfileId);
      data.append("continent", formData.continent);
      data.append("country", formData.country);
      data.append("location", formData.location);
      data.append("description", formData.description);
      // data.append("needs", JSON.stringify(formData.needs));
      formData.needs.forEach((need) => data.append("needs", need));
      // data.append("languages", JSON.stringify(formData.languages));
      formData.languages.forEach((lang) => data.append("languages", lang));
      data.append("availability", JSON.stringify(formData.availability));
      formData.pictureURL.forEach((file) => data.append("pictureURL", file));

      for (let [key, value] of data.entries()) {
        console.log(key, value);
      }

      await addJobOffers(data);

      setSaveMessage({ text: "Job offer created!", type: "success" });
      setFormData({
        title: "",
        continent: "",
        country: "",
        location: "",
        userProfileId: profile || "",
        pictureURL: [],
        description: "",
        needs: [],
        languages: [],
        availability: [],
      });
      setPreviewUrls([]);
      setCurrentIndex(0);
    } catch (err) {
      console.error(err);
      setSaveMessage({
        text: "Error while creating job offer.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-purple-50 p-6 flex flex-col lg:flex-row gap-8">
      {/* Picture gallery */}
      <div className="w-full lg:w-1/3 flex flex-col items-center">
        <div
          className="w-full bg-white shadow-2xl rounded-2xl p-4 flex flex-col items-center justify-between"
          style={{ minHeight: "600px" }}
        >
          {/* main Image */}
          <div className="relative w-full h-80 bg-white rounded-xl overflow-hidden flex items-center justify-center">
            {previewUrls.length > 0 ? (
              <>
                <img
                  src={previewUrls[currentIndex]}
                  alt="Preview"
                  className="w-full h-full object-contain transition-transform duration-500"
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

          {/* thumbnails */}
          {previewUrls.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap justify-center">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt={`Thumb ${idx}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${currentIndex === idx ? "border-black" : "border-transparent"}`}
                    onClick={() => setCurrentIndex(idx)}
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

          {/* upload button */}
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

      {/* form*/}
      <div className="w-full lg:w-2/3">
        <div
          className="card bg-white shadow-2xl rounded-2xl p-6 pb-3"
          style={{ minHeight: "600px" }}
        >
          <h2 className="text-3xl mb-6 font-bold text-black">
            Create Job Offer
          </h2>

          {/* title */}
          <label className="label">
            <span className="label-text font-medium text-gray-700">Title</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full mb-4 shadow-sm focus:ring-2 focus:ring-gray-400 transition"
            placeholder="Enter title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
          />

          {/* continent */}
          <label className="label">
            <span className="label-text font-medium text-gray-700">
              Continent
            </span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full mb-4 shadow-sm focus:ring-2 focus:ring-gray-400 transition"
            placeholder="Enter continent"
            value={formData.continent}
            onChange={(e) => handleInputChange("continent", e.target.value)}
          />

          {/* country */}
          <label className="label">
            <span className="label-text font-medium text-gray-700">
              Country
            </span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full mb-4 shadow-sm focus:ring-2 focus:ring-gray-400 transition"
            placeholder="Enter country"
            value={formData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
          />

          {/* location */}
          <label className="label">
            <span className="label-text font-medium text-gray-700">
              Location
            </span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full mb-4 shadow-sm focus:ring-2 focus:ring-gray-400 transition"
            placeholder="Enter location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
          />

          {/* description */}
          <label className="label">
            <span className="label-text font-medium text-gray-700">
              Description
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full mb-4 shadow-sm focus:ring-2 focus:ring-gray-400 transition"
            placeholder="Enter job description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />

          {/* needs */}
          <label className="label">
            <span className="label-text font-medium text-gray-700">Needs</span>
          </label>
          <div className="relative mb-4">
            <details
              ref={(el) => (dropdownRefs.current[0] = el)}
              className="dropdown dropdown-top w-full"
              onClick={() => handleDropdownToggle(0)}
            >
              <summary className="select select-bordered w-full shadow-sm focus:ring-2 focus:ring-gray-400 transition cursor-pointer flex items-center justify-between">
                <span className="flex-1 text-left">
                  {formData.needs.length > 0
                    ? formData.needs.join(", ")
                    : "Select needs"}
                </span>
              </summary>
              <ul className="dropdown-content menu p-2 shadow bg-gray-100 rounded-box w-full z-10 max-h-60 overflow-y-auto">
                {needsOptions.map((need) => (
                  <li key={need}>
                    <label className="cursor-pointer flex items-center justify-between hover:bg-base-200 px-3 py-2">
                      <span className="flex-1">{need}</span>
                      {formData.needs.includes(need) && (
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
                        checked={formData.needs.includes(need)}
                        onChange={() => toggleSelection("needs", need)}
                        className="hidden"
                      />
                    </label>
                  </li>
                ))}
              </ul>
            </details>
          </div>

          {/* languages */}
          <label className="label">
            <span className="label-text font-medium text-gray-700">
              Languages
            </span>
          </label>
          <div className="relative mb-6">
            <details
              ref={(el) => (dropdownRefs.current[1] = el)}
              className="dropdown dropdown-top w-full"
              onClick={() => handleDropdownToggle(1)}
            >
              <summary className="select select-bordered w-full shadow-sm focus:ring-2 focus:ring-gray-400 transition cursor-pointer flex items-center justify-between">
                <span className="flex-1 text-left">
                  {formData.languages.length > 0
                    ? formData.languages.join(", ")
                    : "Select languages"}
                </span>
              </summary>
              <ul className="dropdown-content menu p-2 shadow bg-gray-100 rounded-box w-full z-10 max-h-60 overflow-y-auto">
                {languageOptions.map((lang) => (
                  <li key={lang}>
                    <label className="cursor-pointer flex items-center justify-between hover:bg-base-200 px-3 py-2">
                      <span className="flex-1">{lang}</span>
                      {formData.languages.includes(lang) && (
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
                        checked={formData.languages.includes(lang)}
                        onChange={() => toggleSelection("languages", lang)}
                        className="hidden"
                      />
                    </label>
                  </li>
                ))}
              </ul>
            </details>
          </div>

          {/* Availability Calendar */}
          <label className="label">
            <span className="label-text font-medium text-gray-700">
              Availability
            </span>
          </label>
          <div className="mb-6">
            <Calendar02
              multiRange={true}
              selectedRanges={formData.availability}
              onMultiRangeSelect={(ranges) =>
                handleInputChange("availability", ranges)
              }
            />

            {formData.availability && formData.availability.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.availability.map((range, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <p className="text-gray-600">
                      <span className="font-medium">
                        {range.from?.toLocaleDateString()}
                      </span>
                      {" - "}
                      <span className="font-medium">
                        {range.to?.toLocaleDateString()}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const newRanges = formData.availability.filter(
                          (_, i) => i !== index
                        );
                        handleInputChange("availability", newRanges);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm px-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* save Button */}
          <button
            className={`btn w-full ${isSaving ? "loading" : ""} bg-black text-white border-none hover:shadow-lg transition`}
            onClick={handleSave}
            disabled={isSaving}
          >
            Save Job Offer
          </button>

          {saveMessage && (
            <p
              className={`mt-4 text-center font-medium ${saveMessage.type === "error" ? "text-red-600" : "text-green-600"}`}
            >
              {saveMessage.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateJob;

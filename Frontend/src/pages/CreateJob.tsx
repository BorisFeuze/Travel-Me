import { useState, useRef, useEffect, type ChangeEvent } from "react";

const CreateJob = () => {
  type JobFormData = {
    location: string;
    userProfileId: string;
    pictureGallery: File[];
    description: string;
    needs: string[];
    languages: string[];
  };

  const [formData, setFormData] = useState<JobFormData>({
    location: "",
    userProfileId: "USER_PROFILE_ID_HERE",
    pictureGallery: [],
    description: "",
    needs: [],
    languages: [],
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const dropdownRefs = useRef<Array<HTMLDetailsElement | null>>([]);

  const needsOptions = ["Cooking", "Teaching", "Building", "Gardening", "First Aid"];
  const languageOptions = ["English", "Spanish", "German", "French", "Portuguese"];

  // Input handling
  const handleInputChange = <K extends keyof JobFormData>(field: K, value: JobFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Add pictures
  const handlePictureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setFormData((prev) => ({ ...prev, pictureGallery: [...prev.pictureGallery, ...fileArray] }));

    const urls = fileArray.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...urls]);
  };

  // delete picture
  const handleRemoveImage = (index: number) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      pictureGallery: prev.pictureGallery.filter((_, i) => i !== index),
    }));
    if (currentIndex >= previewUrls.length - 1 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Selection for needs and languages
  const toggleSelection = (field: "needs" | "languages", value: string) => {
    setFormData((prev) => {
      const list = prev[field];
      if (list.includes(value)) return { ...prev, [field]: list.filter((v) => v !== value) };
      return { ...prev, [field]: [...list, value] };
    });
  };

  // change picture
  const nextImage = () => {
    if (previewUrls.length > 1)
      setCurrentIndex((prev) => (prev + 1) % previewUrls.length);
  };

  const prevImage = () => {
    if (previewUrls.length > 1)
      setCurrentIndex((prev) => (prev === 0 ? previewUrls.length - 1 : prev - 1));
  };

  // close dropdown
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

  const handleDropdownToggle = (index: number) => {
    dropdownRefs.current.forEach((ref, i) => {
      if (ref && i !== index) ref.removeAttribute("open");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6 flex flex-col lg:flex-row gap-8">
      
      {/* Picture Gallery */}
      <div className="w-full lg:w-1/3 flex flex-col items-center">
        <div className="w-full bg-white shadow-2xl rounded-2xl p-4 flex flex-col items-center justify-between" style={{ minHeight: "600px" }}>
          
          {/* Main Image */}
          <div className="relative w-full h-80 bg-white rounded-xl overflow-hidden flex items-center justify-center">
            {previewUrls.length > 0 ? (
              <>
                <img
                  src={previewUrls[currentIndex]}
                  alt="Preview"
                  className="w-full h-full object-contain transition-transform duration-500"
                />

                {/* Left arrow */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 bg-white/70 hover:scale-110 transition p-2 rounded-full shadow"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Right arrow */}
                <button
                  onClick={nextImage}
                  className="absolute right-2 bg-white/70 hover:scale-110 transition p-2 rounded-full shadow"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            ) : (
              <div className="text-gray-500 text-center">No images added</div>
            )}
          </div>

          {/* delete picture */}
          {previewUrls.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap justify-center">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt={`Thumb ${idx}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${
                      currentIndex === idx ? "border-black" : "border-transparent"
                    }`}
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

          {/* Add pictures Button */}
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

      {/* Form */}
      <div className="w-full lg:w-2/3">
        <div className="card bg-white shadow-2xl rounded-2xl p-6 pb-3" style={{ minHeight: "600px" }}>
          <h2 className="text-3xl mb-6 font-bold text-black">Create Job Offer</h2>

          {/* Location */}
          <label className="label">
            <span className="label-text font-medium text-gray-700">Location</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full mb-4 shadow-sm focus:ring-2 focus:ring-gray-400 transition"
            placeholder="Enter location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
          />

          {/* Description */}
          <label className="label">
            <span className="label-text font-medium text-gray-700">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full mb-4 shadow-sm focus:ring-2 focus:ring-gray-400 transition"
            placeholder="Enter job description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />

          {/* Needs Dropdown */}
          <label className="label">
            <span className="label-text font-medium text-gray-700">Needs</span>
          </label>
          <div className="relative mb-4">
            <details
              ref={(el) => { dropdownRefs.current[0] = el; }}
              className="dropdown dropdown-top w-full"
              onClick={() => handleDropdownToggle(0)}
            >
              <summary className="select select-bordered w-full shadow-sm cursor-pointer flex items-center justify-between">
                <span className="flex-1 text-left">
                  {formData.needs.length > 0 ? formData.needs.join(", ") : "Select Needs"}
                </span>
              </summary>
              <ul className="dropdown-content menu p-2 shadow bg-gray-100 rounded-box w-full z-10 max-h-60 overflow-y-auto">
                {needsOptions.map((need) => (
                  <li key={need}>
                    <label className="cursor-pointer flex items-center justify-between hover:bg-base-200 px-3 py-2">
                      <span className="flex-1">{need}</span>
                      {formData.needs.includes(need) && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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

          {/* Languages Dropdown */}
          <label className="label">
            <span className="label-text font-medium text-gray-700">Languages</span>
          </label>
          <div className="relative mb-4">
            <details
              ref={(el) => { dropdownRefs.current[1] = el; }}
              className="dropdown dropdown-top w-full"
              onClick={() => handleDropdownToggle(1)}
            >
              <summary className="select select-bordered w-full shadow-sm cursor-pointer flex items-center justify-between">
                <span className="flex-1 text-left">
                  {formData.languages.length > 0 ? formData.languages.join(", ") : "Select Languages"}
                </span>
              </summary>
              <ul className="dropdown-content menu p-2 shadow bg-gray-100 rounded-box w-full z-10 max-h-60 overflow-y-auto">
                {languageOptions.map((lang) => (
                  <li key={lang}>
                    <label className="cursor-pointer flex items-center justify-between hover:bg-base-200 px-3 py-2">
                      <span className="flex-1">{lang}</span>
                      {formData.languages.includes(lang) && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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

          {/* button Create job offer */}
          <button className="btn w-full mt-24.5 bg-black text-white border-none hover:shadow-lg transition">
            Create Job Offer
          </button>
        </div>
      </div>
    </div>
  );
};
export default CreateJob;

import { useState, useEffect } from "react";
import { addUserDetails, getUserDetails } from "@/data";

const VolunteerAccountPage = () => {
  type VolunteerFormData = UserProfileFormData & Pick<RegisterData, "firstName" | "lastName" | "email" | "phoneNumber">;

  const [formData, setFormData] = useState<VolunteerFormData>({
    pictureURL: "",
    userId: "",
    age: undefined,
    continent: "",
    country: "",
    gender: "",
    skills: [],
    languages: [],
    educations: [],
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: 0,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const skillOptions = ["Cooking", "Teaching", "Building", "Gardening", "First Aid"];
  const languageOptions = ["English", "Spanish", "German", "French", "Portuguese"];
  const educationOptions = ["High School", "Bachelor's", "Master's", "PhD"];

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getUserDetails();
        if (user) {
          setFormData(prev => ({ ...prev, ...user }));
          setPreviewUrl(user.pictureURL || null);
        }
      } catch (err) {
        console.error("Failed to load user data", err);
      }
    };
    loadUser();
  }, []);

  const handleInputChange = <K extends keyof VolunteerFormData>(
    field: K,
    value: VolunteerFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await addUserDetails(formData);
      setSaveMessage({ text: "Changes saved successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setSaveMessage({ text: "Error while saving changes.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-base-200 p-4 gap-8">

      {/* Left-Side: Profile Picture */}
      <div className="w-full lg:w-1/3 flex flex-col items-center gap-4">
     <div className="avatar mb-4">
        <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-1/2 h-1/2 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"
                />
              </svg>
            </div>
          )}
        </div>
     </div>
          {/* Register infos */}
        <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg w-full text-center flex flex-col gap-2">
          <div className="flex justify-center gap-2 font-bold text-xl">
            <span>{formData.firstName}</span>
            <span>{formData.lastName}</span>
          </div>
          <p>{formData.email}</p>
          <p>{formData.phoneNumber}</p>
        </div>
      </div>

      {/* Rightside: Form for User */}
      <div className="w-full lg:w-2/3">
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Edit Volunteer Details</h2>
            {saveMessage && (
              <div className={`alert mb-4 ${saveMessage.type === "success" ? "alert-success" : "alert-error"}`}>
                <span>{saveMessage.text}</span>
              </div>
            )}

            <label className="label">
              <span className="label-text">Age</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full mb-4"
              placeholder="Enter your age"
              value={formData.age ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                const numberValue = value === "" ? undefined : Number(value);
                handleInputChange("age", numberValue);
              }}
            />

            <label className="label">
              <span className="label-text">Country</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full mb-4"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
            />

            <label className="label">
              <span className="label-text">Continent</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full mb-4"
              value={formData.continent}
              onChange={(e) => handleInputChange("continent", e.target.value)}
            />

            <label className="label">
              <span className="label-text">Gender</span>
            </label>
            <select
              className="select select-bordered w-full mb-4"
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
            >
              <option value="">Select gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="diverse">Others</option>
            </select>

           
            <label className="label">
              <span className="label-text">Skills</span>
            </label>
            <select
              className="select select-bordered w-full mb-4"
              value={formData.skills[0] ?? ""}
              onChange={(e) => handleInputChange("skills", [e.target.value])}
            >
              <option value="">Select a skill</option>
              {skillOptions.map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>

         
            <label className="label">
              <span className="label-text">Languages</span>
            </label>
            <select
              className="select select-bordered w-full mb-4"
              value={formData.languages[0] ?? ""}
              onChange={(e) => handleInputChange("languages", [e.target.value])}
            >
              <option value="">Select a language</option>
              {languageOptions.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>

            
            <label className="label">
              <span className="label-text">Education</span>
            </label>
            <select
              className="select select-bordered w-full mb-6"
              value={formData.educations[0] ?? ""}
              onChange={(e) => handleInputChange("educations", [e.target.value])}
            >
              <option value="">Select education</option>
              {educationOptions.map((edu) => (
                <option key={edu} value={edu}>{edu}</option>
              ))}
            </select>

            <button
              className="btn btn-neutral w-full"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerAccountPage;

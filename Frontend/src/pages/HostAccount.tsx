import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import {
  addUserDetails,
  getUserDetails,
  getJobOffers,
  updateUserDetails,
} from "@/data";
import { useAuth } from "@/context";
import { JobCard } from "@/components/UI";
// import { validateDiaryForm } from "@/utils";

const HostAccount = () => {
  const navigate = useNavigate();

  type VolunteerFormData = UserProfileFormData &
    Pick<RegisterData, "firstName" | "lastName" | "email" | "phoneNumber">;
  const { user } = useAuth();

  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [jobOffers, setJobOffers] = useState<JobCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [saveMessage, setSaveMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const [formData, setFormData] = useState<UserProfileFormData>({
    pictureURL: undefined,
    userId: "",
    age: undefined,
    continent: "",
    country: "",
    gender: "",
    skills: [],
    languages: [],
    educations: [],
  });

  const skillOptions = [
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
  const educationOptions = ["High School", "Bachelor's", "Master's", "PhD"];
  const genderOptions = ["Female", "Male", "Other"];

  //for dropedown closing
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (!target.closest(".dropdown")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getUserDetails(user!._id ?? "");

        if (currentUser) {
          const dataCurrentUser = currentUser.userProfiles?.[0];
          const currentnUserProfil = dataCurrentUser?.pictureURL?.[0];
          console.log(currentnUserProfil);
          setFormData((prev) => ({ ...prev, ...dataCurrentUser }));
          setPreviewUrl(currentnUserProfil || null);
          if (dataCurrentUser?._id) setProfileId(dataCurrentUser._id);
        }
      } catch (err) {
        console.error("Failed to load user data", err);
      }
    };
    loadUser();
  }, []);

  //Load job offers
  useEffect(() => {
    if (!user) return;

    const loadJobOffers = async () => {
      setLoading(true);
      try {
        const data = await getJobOffers(user._id);

        if (data && Array.isArray(data.jobOffers)) {
          const filteredJobs = data.jobOffers.filter(
            (job: JobFormData) => job.userProfileId === user._id
          );

          const mappedJobs: JobCardData[] = filteredJobs.map(
            (job: JobFormData) => ({
              _id: job._id,
              title: job.title,
              location: job.location,
              image:
                typeof job.pictureURL?.[0] === "string"
                  ? job.pictureURL[0]
                  : undefined,
            })
          );

          setJobOffers(mappedJobs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadJobOffers();
  }, [user]);

  const handleInputChange = <K extends keyof VolunteerFormData>(
    field: K,
    value: VolunteerFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePictureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    console.log(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!formData.continent || !formData.country || !formData.gender) {
      setSaveMessage({
        text: "Please fill all required fields.",
        type: "error",
      });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    formData.userId = user!._id;
    formData.pictureURL = selectedFile ?? undefined;

    try {
      const data = new FormData();
      data.append("userId", formData.userId);

      if (formData.pictureURL instanceof File) {
        data.append("pictureURL", formData.pictureURL);
      }

      data.append("age", formData.age?.toString() || "");
      data.append("continent", formData.continent);
      data.append("country", formData.country);
      data.append("gender", formData.gender);
      data.append("skills", JSON.stringify(formData.skills));
      data.append("languages", JSON.stringify(formData.languages));
      data.append("educations", JSON.stringify(formData.educations));

      console.log(data);

      let updatedUser;
      if (profileId) {
        updatedUser = await updateUserDetails(profileId, data);
      } else {
        updatedUser = await addUserDetails(data);

        if (updatedUser?.userProfile?._id) {
          setProfileId(updatedUser.userProfile._id);
        }
      }

      // const updatedUser = await addUserDetails(data);

      // console.log(updatedUser);

      setSaveMessage({ text: "Changes saved successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setSaveMessage({ text: "Error while saving changes.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6 gap-8 pt-30">
      <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6 gap-8">
        {/* Left Side: Profile Picture */}
        <div className="w-full lg:w-1/3 flex flex-col items-center gap-6 bg-white rounded-2xl shadow-xl p-6">
          <div className="avatar mb-4">
            <div className="w-44 h-44 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center transition-transform duration-300 hover:scale-105">
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
                    className="w-1/2 h-1/2 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <label className="btn btn-neutral btn-outline w-40 bg-black text-white transition">
            Add Picture
            <input
              type="file"
              name="picture"
              accept="image/*"
              className="hidden"
              onChange={handlePictureUpload}
            />
          </label>

          <div className="bg-purple-50/70 backdrop-blur-sm p-4 rounded-xl w-full text-center flex flex-col gap-1">
            <h2 className="text-xl font-semibold">
              {user!.firstName} {user!.lastName}
            </h2>

            <div className="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
              <p className="text-gray-600">{user!.email}</p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
              <p className="text-gray-600">{user!.phoneNumber}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-2/3">
          <div className="card bg-white shadow-2xl rounded-2xl">
            <div className="card-body p-8">
              <h2 className="card-title text-3xl mb-6 font-bold text-black">
                Edit Host Profile
              </h2>

              {saveMessage && (
                <div
                  className={`alert mb-6 ${
                    saveMessage.type === "success"
                      ? "alert-success"
                      : "alert-error"
                  }`}
                >
                  <span>{saveMessage.text}</span>
                </div>
              )}

              {/* Age */}
              <label className="label">
                <span className="label-text font-medium text-gray-700">
                  Age
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full mb-4 shadow-sm focus:ring-2 focus:ring-gray-400 transition"
                placeholder="Enter your age"
                value={formData.age ?? ""}
                onChange={(e) =>
                  handleInputChange(
                    "age",
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
              />

              {/* Country */}
              <label className="label">
                <span className="label-text font-medium text-gray-700">
                  Country
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full mb-4 shadow-sm focus:ring-2 focus:ring-gray-400 transition"
                placeholder="Enter your country"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
              />

              {/* Continent */}
              <label className="label">
                <span className="label-text font-medium text-gray-700">
                  Continent
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full mb-4 shadow-sm focus:ring-2 focus:ring-gray-400 transition"
                placeholder="Enter your continent"
                value={formData.continent}
                onChange={(e) => handleInputChange("continent", e.target.value)}
              />

              {/* Gender */}
              <label className="label">
                <span className="label-text font-medium text-gray-700">
                  Gender
                </span>
              </label>
              <div className="relative mb-4">
                <details
                  className="dropdown dropdown-top w-full"
                  open={openDropdown === "gender"}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenDropdown(
                      openDropdown === "gender" ? null : "gender"
                    );
                  }}
                >
                  <summary className="select select-bordered w-full shadow-sm focus:ring-2 focus:ring-gray-400 transition cursor-pointer flex items-center justify-between">
                    <span className="flex-1 text-left">
                      {formData.gender || "Select gender"}
                    </span>
                  </summary>
                  <ul className="dropdown-content menu p-2 shadow bg-gray-100 rounded-box w-full z-10 max-h-60 overflow-y-auto">
                    {genderOptions.map((gender) => (
                      <li key={gender}>
                        <label
                          className="cursor-pointer flex items-center justify-between hover:bg-base-200 px-3 py-2"
                          onClick={() => {
                            handleInputChange("gender", gender.toLowerCase());
                            setOpenDropdown(null);
                          }}
                        >
                          <span className="flex-1">{gender}</span>
                          {formData.gender === gender.toLowerCase() && (
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
                        </label>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>

              {/* Education */}
              <label className="label">
                <span className="label-text font-medium text-gray-700">
                  Education
                </span>
              </label>
              <div className="relative mb-4">
                <details
                  className="dropdown dropdown-top w-full"
                  open={openDropdown === "education"}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenDropdown(
                      openDropdown === "education" ? null : "education"
                    );
                  }}
                >
                  <summary className="select select-bordered w-full shadow-sm focus:ring-2 focus:ring-gray-400 transition cursor-pointer flex items-center justify-between">
                    <span className="flex-1 text-left">
                      {formData.educations[0] || "Select education"}
                    </span>
                  </summary>
                  <ul className="dropdown-content menu p-2 shadow bg-gray-100 rounded-box w-full z-10 max-h-60 overflow-y-auto">
                    {educationOptions.map((edu) => (
                      <li key={edu}>
                        <label
                          className="cursor-pointer flex items-center justify-between hover:bg-base-200 px-3 py-2"
                          onClick={() => {
                            handleInputChange("educations", [edu]);
                            setOpenDropdown(null);
                          }}
                        >
                          <span className="flex-1">{edu}</span>
                          {formData.educations[0] === edu && (
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
                        </label>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>

              {/* Skills */}
              <label className="label">
                <span className="label-text font-medium text-gray-700">
                  Skills
                </span>
              </label>
              <div className="relative mb-4">
                <details
                  className="dropdown dropdown-top w-full"
                  open={openDropdown === "skills"}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenDropdown(
                      openDropdown === "skills" ? null : "skills"
                    );
                  }}
                >
                  <summary className="select select-bordered w-full shadow-sm focus:ring-2 focus:ring-gray-400 transition cursor-pointer flex items-center justify-between">
                    <span className="flex-1 text-left">
                      {formData.skills.length > 0
                        ? formData.skills.join(", ")
                        : "Select skills"}
                    </span>
                  </summary>
                  <ul className="dropdown-content menu p-2 shadow bg-gray-100 rounded-box w-full z-10 max-h-60 overflow-y-auto">
                    {skillOptions.map((skill) => (
                      <li key={skill}>
                        <label
                          className="cursor-pointer flex items-center justify-between hover:bg-base-200 px-3 py-2"
                          onClick={() => {
                            handleInputChange(
                              "skills",
                              formData.skills.includes(skill.toLowerCase())
                                ? formData.skills.filter((s) => s !== skill.toLowerCase())
                                : [...formData.skills, skill.toLowerCase()]
                            );
                          }}
                        >
                          <span className="flex-1">{skill}</span>
                          {formData.skills.includes(skill.toLowerCase()) && (
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
                            checked={formData.skills.includes(skill)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleInputChange("skills", [
                                  ...formData.skills,
                                  skill,
                                ]);
                              } else {
                                handleInputChange(
                                  "skills",
                                  formData.skills.filter((s) => s !== skill)
                                );
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>

              {/* Languages */}
              <label className="label">
                <span className="label-text font-medium text-gray-700">
                  Languages
                </span>
              </label>
              <div className="relative mb-4">
                <details
                  className="dropdown dropdown-top w-full"
                  open={openDropdown === "languages"}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenDropdown(
                      openDropdown === "languages" ? null : "languages"
                    );
                  }}
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
                        <label
                          className="cursor-pointer flex items-center justify-between hover:bg-base-200 px-3 py-2"
                          onClick={() => {
                            handleInputChange(
                              "languages",
                              formData.languages.includes(lang.toLowerCase())
                                ? formData.languages.filter((l) => l !== lang.toLowerCase())
                                : [...formData.languages, lang.toLowerCase()]
                            );
                          }}
                        >
                          <span className="flex-1">{lang}</span>
                          {formData.languages.includes(lang.toLowerCase()) && (
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
                        </label>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>

              <button
                className="btn bg-black hover:bg-black-700 text-white w-full py-3 rounded-xl transition shadow-lg"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Job Offers */}
        <h2 className="text-xl font-semibold mt-8 mb-4">Your Job Offers</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {jobOffers.map((job) => (
            <JobCard
              key={job._id}
              _id={job._id}
              title={job.title}
              location={job.location}
              image={job.image}
            />
          ))}

          {/* Plus Card */}
          <div
            onClick={() => navigate("/create-job")}
            className="cursor-pointer flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 aspect-[4/3]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-16 h-16 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <p className="mt-2 text-gray-500 font-medium">Add Job Offer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostAccount;

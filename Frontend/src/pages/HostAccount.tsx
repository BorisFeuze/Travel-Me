import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import {
  addUserDetails,
  getUserDetails,
  getJobOffers,
  updateUserDetails,
} from "@/data";
import { useAuth, useUser } from "@/context";
import { JobCard } from "@/components/UI";

const HostAccount = () => {
  const navigate = useNavigate();

  type VolunteerFormData = UserProfileFormData &
    Pick<RegisterData, "firstName" | "lastName" | "email" | "phoneNumber">;
  const { user } = useAuth();
  // const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | File>();
  const [profileId, setProfileId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [jobOffers, setJobOffers] = useState<JobCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const { getUserProfile } = useUser();

  const [saveMessage, setSaveMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const [formData, setFormData] = useState<UserProfileFormData>({
    pictureURL: "",
    userId: "",
    age: undefined,
    continent: "",
    country: "",
    address: "",
    description: "",
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
          const dataCurrentUser = currentUser.userProfiles[0];
          const currentnUserProfil = dataCurrentUser.pictureURL;
          console.log(currentnUserProfil);

          if (currentnUserProfil) {
            setFormData((prev) => ({ ...prev, ...dataCurrentUser }));
            setPreviewUrl(currentnUserProfil);
          }
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
        const profile = await getUserProfile(user?._id ?? "");
        console.log(profile);

        if (!profile?.userProfiles[0]) {
          console.error("please created a account");
        }

        const data = await getJobOffers(profile?.userProfiles[0]._id as string);

        // console.log(data);

        if (data && Array.isArray(data.jobOffers)) {
          const filteredJobs = data.jobOffers.filter(
            (job: JobData) => job.userProfileId === profile?.userProfiles[0]._id
          );

          console.log(filteredJobs);

          const mappedJobs: JobCardData[] = filteredJobs.map(
            (job: JobData) => ({
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

  console.log(jobOffers);

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
      data.append("address", formData.address);
      data.append("description", formData.description);
      data.append("gender", formData.gender);
      formData.educations.forEach((edu) => data.append("educations", edu));
      formData.skills?.forEach((ski) => data.append("skills", ski));
      formData.languages.forEach((lan) => data.append("languages", lan));

      for (let [key, value] of data.entries()) {
        console.log(key, value);
      }

      let updatedUser;
      if (profileId) {
        updatedUser = await updateUserDetails(profileId, data);
      } else {
        updatedUser = await addUserDetails(data);

        console.log(updatedUser);

        if (updatedUser?.userProfiles[0]._id) {
          setProfileId(updatedUser.userProfiles[0]._id);
        }
      }

      // const updatedUser = await addUserDetails(data);

      console.log(updatedUser);

      setSaveMessage({ text: "Changes saved successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setSaveMessage({ text: "Error while saving changes.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto px-6 space-y-6">
        <h1 className="mx-auto w-full max-w-7xl text-center text-4xl font-bold text-gray-900">
          Host Account Details
        </h1>
        {/* PROFILE HEADER CARD stays first, full width */}
        <section className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-200 grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 items-start">
          {/* left column: avatar + name + contact */}
          <div className="flex flex-col px-6 items-center md:items-start gap-3">
            <div className="relative w-24 h-24">
              <img
                src={previewUrl as string}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border border-gray-200"
              />

              <label className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 cursor-pointer hover:bg-gray-800 transition">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePictureUpload}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </label>
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600 text-sm">{user?.email}</p>
              <p className="text-gray-600 text-sm">{user?.phoneNumber}</p>
            </div>
          </div>

          {/* right column: description stretches across remaining space */}
          <div>
            <label className="text-base font-semibold text-gray-900 block mb-1">
              Description
            </label>
            <textarea
              placeholder="Please introduce yourself as a host and describe your place."
              className="w-full min-h-[120px] rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 resize-y capitalize"
              value={formData.description}
              onChange={(e) =>
                handleInputChange("description", e.target.value as any)
              }
            />
          </div>
        </section>

        {/* 2-COLUMN DASHBOARD GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* --- Basic Information --- */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 flex flex-col gap-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Basic Information
              </h3>
              <p className="text-sm text-gray-500">Your personal details</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Full Name</label>
                <input
                  disabled
                  value={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 disabled:opacity-100"
                  placeholder="Full Name"
                  title="Full Name"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Age</label>
                <input
                  type="number"
                  placeholder="Enter your age"
                  title="Age"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20"
                  value={formData.age ?? ""}
                  onChange={(e) =>
                    handleInputChange(
                      "age",
                      e.target.value === "" ? undefined : Number(e.target.value)
                    )
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">Gender</label>
              <select
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20"
                value={formData.gender || ""}
                title="Select gender"
                aria-label="Select gender"
                onChange={(e) => handleInputChange("gender", e.target.value)}
              >
                <option value="">Select gender</option>
                {genderOptions.map((g) => (
                  <option key={g} value={g.toLowerCase()}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* --- Education --- */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 flex flex-col gap-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Education
              </h3>
              <p className="text-sm text-gray-500">
                Your educational background
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="education-select"
                className="text-sm text-gray-700"
              >
                Highest Level
              </label>
              <select
                id="education-select"
                title="Highest Level"
                aria-label="Highest Level"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20"
                value={formData.educations[0] || ""}
                onChange={(e) =>
                  handleInputChange("educations", [e.target.value])
                }
              >
                <option value="" disabled>
                  Select highest level
                </option>
                {educationOptions.map((edu) => (
                  <option key={edu} value={edu}>
                    {edu}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* --- Location --- */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 flex flex-col gap-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Location
              </h3>
              <p className="text-sm text-gray-500">Where you're based</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Country</label>
                <input
                  type="text"
                  placeholder="Enter your country"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 capitalize"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Address</label>
                <input
                  type="text"
                  placeholder="Enter your address"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 capitalize"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Continent</label>
                <input
                  type="text"
                  placeholder="Enter your continent"
                  title="Continent"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 capitalize"
                  value={formData.continent}
                  onChange={(e) =>
                    handleInputChange("continent", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* --- Skills --- */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 flex flex-col gap-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Skills</h3>
              <p className="text-sm text-gray-500">Your professional skills</p>
            </div>

            {/* current chips */}
            <div className="flex flex-wrap gap-2">
              {formData.skills.length === 0 && (
                <p className="text-sm text-gray-400">No skills yet</p>
              )}

              {formData.skills.map((s) => (
                <span
                  key={s}
                  className="bg-gray-100 border border-gray-300 rounded-full text-sm text-gray-800 flex items-center gap-2 px-3 py-1"
                >
                  {s}
                  <button
                    className="text-gray-500 hover:text-gray-900"
                    onClick={() =>
                      handleInputChange(
                        "skills",
                        formData.skills.filter((x) => x !== s)
                      )
                    }
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* add new skill */}
            <select
              title="Add a new skill"
              aria-label="Add a new skill"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20"
              onChange={(e) => {
                const val = e.target.value;
                if (val && !formData.skills.includes(val)) {
                  handleInputChange("skills", [...formData.skills, val]);
                }
              }}
            >
              <option value="">Add a new skill</option>
              {skillOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* --- Languages --- */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 flex flex-col gap-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Languages
              </h3>
              <p className="text-sm text-gray-500">Languages you speak</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.languages.length === 0 && (
                <p className="text-sm text-gray-400">No languages yet</p>
              )}

              {formData.languages.map((l) => (
                <span
                  key={l}
                  className="bg-gray-100 border border-gray-300 rounded-full text-sm text-gray-800 flex items-center gap-2 px-3 py-1"
                >
                  {l}
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-900"
                    onClick={() =>
                      handleInputChange(
                        "languages",
                        formData.languages.filter((x) => x !== l)
                      )
                    }
                    aria-label={`Remove ${l}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <select
              title="Add language"
              aria-label="Add language"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20"
              onChange={(e) => {
                const val = e.target.value;
                if (val && !formData.languages.includes(val.toLowerCase())) {
                  handleInputChange("languages", [
                    ...formData.languages,
                    val.toLowerCase(),
                  ]);
                }
              }}
            >
              <option value="">Add language</option>
              {languageOptions.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* --- Job Offers --- */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 flex flex-col gap-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Job Offers
              </h3>
              <p className="text-sm text-gray-500">
                Current opportunities you've received
              </p>
            </div>

            {/* Job Offers List */}
            {/* {loading ? (
                <p className="text-gray-500 text-sm">Loading your offers…</p>
              ) : (
                <div className="space-y-4">
                  {jobOffers.slice(0, 2).map((job) => (
                    <div
                      key={job._id}
                      className="rounded-xl border border-gray-200 p-4 flex flex-col gap-2"
                    >
                      <div className="text-sm font-semibold text-gray-900">
                        {job.title}
                      </div>
                      <div className="text-sm text-gray-600">{job.location}</div>

                      <button
                        className="w-full text-center rounded-lg bg-black text-white text-sm font-medium py-2 hover:bg-gray-800"
                        onClick={() => navigate(`/job/${job._id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  ))}

                  {/* Add job card */}
            <div
              onClick={() => navigate("/create-job")}
              className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center py-8 hover:bg-gray-50 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <p className="text-gray-500 text-sm font-medium mt-2">
                Add Job Offer
              </p>
            </div>
          </div>
        </section>

        {/* Job Offers — responsive grid */}
        <section className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Your Job Offers</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mt-2">
            {jobOffers.map((job) => (
              <JobCard
                key={job._id}
                _id={job._id}
                title={job.title}
                location={job.location}
                image={job.image}
              />
            ))}

            {/* Plus Card could delete*/}
            {/* <div
              onClick={() => navigate("/create-job")}
              className="cursor-pointer flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 aspect-4/3"
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
            </div> */}
          </div>
        </section>

        {/* Save Button under the grid */}
        <div className="flex justify-center">
          <button
            className="inline-flex items-center justify-center rounded-xl bg-black px-8 py-3 text-white text-sm font-medium shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-50"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostAccount;

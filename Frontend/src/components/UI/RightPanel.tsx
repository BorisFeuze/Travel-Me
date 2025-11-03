import { useEffect, useState, useMemo } from "react";
import { useAuth, useUser } from "@/context";
import { getUserDetails, getJobOffers } from "@/data";
import { useNavigate } from "react-router";

type RightPanelProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const RightPanel = ({ isOpen, onToggle }: RightPanelProps) => {
  const { signedIn, handleSignOut, user } = useAuth();
  const { allUsers } = useUser();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobCardData[]>([]);

  const currUserProfile =
    allUsers.find((u: UserProfileData) => u.userId === user?._id) || null;

  useEffect(() => {
    if (!user?._id) return;

    (async () => {
      try {
        setLoading(true);
        const data = await getUserDetails(user._id);
        const userInfo = data?.userProfiles?.[0] || currUserProfile || null;
        if (userInfo) setProfile(userInfo);

        if (userInfo?._id) {
          const jobData = await getJobOffers(userInfo._id);
          if (jobData && Array.isArray(jobData.jobOffers)) {
            const ownJobs = jobData.jobOffers
              .filter((j: JobData) => j.userProfileId === userInfo._id)
              .map((j: JobData) => ({
                _id: j._id,
                title: j.title,
                location: j.location,
                image:
                  typeof j.pictureURL?.[0] === "string"
                    ? j.pictureURL[0]
                    : undefined,
              }));
            setJobs(ownJobs);
          }
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?._id, currUserProfile]);

  const handleGoToProfile = () => {
    const role = Array.isArray(user?.roles) ? user!.roles[0] : undefined;
    if (role === "host") navigate("/hostAccount");
    else navigate("/volunteerAccount");
  };

  const handleCreateJob = () => {
    navigate("/create-job");
  };

  // date
  const today = useMemo(() => new Date(), []);
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-11
  const monthLabel = today.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  // calendar generation
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const calendarCells: Array<{ day: number | null }> = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push({ day: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({ day: d });
  }

  if (loading) {
    return (
      <aside className="bg-white border-l border-slate-200 text-slate-800 flex flex-col items-center justify-center min-h-screen w-80 fixed top-0 right-0 z-40">
        <p className="text-sm text-slate-400">Loading…</p>
      </aside>
    );
  }

  return (
    <aside
      className={`
        fixed top-0 right-0 h-screen z-40
        w-80 bg-white
        border-l border-slate-200
        flex flex-col
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-[calc(100%-1.75rem)]"}
      `}
    >
      {/* toggle */}
      <button
        onClick={onToggle}
        className="
          absolute -left-7 top-1/2 -translate-y-1/2
          w-7 h-14 rounded-l-md bg-white border border-slate-200
          text-slate-500 text-base
          flex items-center justify-center
          shadow-sm hover:bg-slate-50 transition cursor-pointer
        "
        title={isOpen ? "Close panel" : "Open panel"}
      >
        {isOpen ? "›" : "‹"}
      </button>

      {/* header */}
      <div className="px-5 py-4 border-b border-slate-200 bg-white/80">
        {signedIn ? (
          <div className="flex items-start gap-3">
            <button
              onClick={handleGoToProfile}
              className="shrink-0 focus:outline-none focus:ring-2 focus:ring-sky-200 rounded-md"
            >
              {profile?.pictureURL ? (
                <img
                  src={profile.pictureURL as string}
                  alt="User"
                  className="w-12 h-12 rounded-md object-cover border border-slate-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-md bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-500 border border-slate-200">
                  {user?.firstName?.[0] ?? "U"}
                </div>
              )}
            </button>

            <div className="flex-1 min-w-0">
              <p
                onClick={handleGoToProfile}
                className="text-base font-semibold text-slate-900 leading-tight cursor-pointer hover:text-sky-600"
              >
                {user?.firstName ||
                  `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                  "User"}
              </p>
              <p className="text-xs text-slate-500">{user?.email ?? ""}</p>

              <button
                onClick={handleSignOut}
                className="mt-3 w-full py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-full transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-base font-semibold text-slate-900">
              You’re not logged in
            </p>
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center justify-center rounded-full bg-sky-500 text-white text-sm font-medium py-2 hover:bg-sky-400 transition"
            >
              Login
            </button>
          </div>
        )}
      </div>

      {/* content */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50">
        {/* 1. YOUR JOB OFFERS */}
        <div className="px-5 pt-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[14px] font-semibold text-slate-900">
              Your job offers
            </h3>
            {signedIn && (
              <button
                onClick={handleCreateJob}
                className="text-[0.9rem] text-pink-600 hover:text-black cursor-pointer"
              >
                + Add
              </button>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-md p-3 max-h-56 overflow-y-auto space-y-2">
            {signedIn ? (
              jobs.length === 0 ? (
                <p className="text-xs text-slate-500">
                  You don’t have any job yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {jobs.slice(0, 10).map((job) => (
                    <li
                      key={job._id}
                      onClick={() => navigate(`/job/${job._id}`)}
                      className="flex items-center gap-3 rounded-md border border-transparent bg-slate-50 hover:bg-slate-100 hover:border-slate-200 px-2.5 py-2 cursor-pointer transition"
                    >
                      {job.image ? (
                        <img
                          src={job.image}
                          alt={job.title}
                          className="w-10 h-10 rounded-md object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-[9px] text-slate-500 border border-slate-200">
                          JOB
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-slate-900 truncate">
                          {job.title}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {job.location || "No location provided"}
                        </p>
                      </div>
                      <span className="text-[14px] text-slate-400">›</span>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              <p className="text-xs text-slate-500">
                Log in to view your job offers.
              </p>
            )}
          </div>
        </div>

        {/* 2. TODAY BOX */}
        <div className="px-5 pt-5">
          <div className="bg-white border border-slate-200 rounded-md px-4 py-3.5 flex items-center justify-between gap-3 shadow-sm/10">
            <div>
              <p className="text-xs text-slate-500">Today</p>
              <p className="text-sm font-medium text-slate-900">
                {today.toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreateJob}
                disabled={!signedIn}
                className={`text-xs px-3 py-1.5 rounded-sm transition ${
                  signedIn
                    ? "bg-pink-600 text-white hover:bg-black cursor-pointer"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                + Job
              </button>
            </div>
          </div>
        </div>

        {/* 3. CALENDAR */}
        <div className="px-5 pt-5 pb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-medium text-slate-800 tracking-tight">
              {monthLabel}
            </p>
            <div className="flex gap-1">
              <button className="text-xs px-2 py-1 bg-white border border-slate-200 rounded-sm hover:bg-slate-50">
                {"‹"}
              </button>
              <button className="text-xs px-2 py-1 bg-white border border-slate-200 rounded-sm hover:bg-slate-50">
                {"›"}
              </button>
            </div>
          </div>

          {/* header giorni */}
          <div className="grid grid-cols-7 gap-1 text-[11px] text-center text-slate-400 mb-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
              <span key={d} className="py-1.5 font-medium">
                {d}
              </span>
            ))}
          </div>

          {/* days */}
          <div className="grid grid-cols-7 gap-1 text-[12px] text-center">
            {calendarCells.map((cell, idx) => {
              const isToday = cell.day === today.getDate();
              return cell.day ? (
                <span
                  key={idx}
                  className={`py-2 rounded-md border text-center ${
                    isToday
                      ? "bg-sky-100 border-sky-200 text-slate-900 font-semibold"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {cell.day}
                </span>
              ) : (
                <span key={idx} className="py-2 rounded-md" />
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;

import { useEffect, useState } from "react";
import { useAuth } from "@/context";
import { getUserDetails } from "@/data";
import { useNavigate } from "react-router";

const RightPanel = () => {
  const { user } = useAuth();
  const [info, setInfo] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;

    (async () => {
      try {
        setLoading(true);
        const data = await getUserDetails(user._id);
        const userInfo = data?.userProfiles?.[0];
        if (userInfo) setInfo(userInfo);
      } catch (err) {
        console.error("Error fetching user details:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?._id]);

  const handleGoToProfile = () => {
    const role = Array.isArray(user?.roles) ? user!.roles[0] : undefined;
    if (role === "host") {
      navigate("/hostAccount");
    } else {
      navigate("/volunteerAccount");
    }
  };

  if (loading) {
    return (
      <aside className="bg-slate-900/70 backdrop-blur-md border-l border-slate-800 text-slate-100 flex flex-col items-center justify-center min-h-screen">
        <p className="text-xs text-slate-400">Loading profile...</p>
      </aside>
    );
  }

  return (
    <aside
      className="
        bg-slate-900/70 backdrop-blur-md
        border-l border-slate-800
        text-slate-100
        flex flex-col
        z-40
      "
    >
      {/* user header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800">
        <button
          onClick={handleGoToProfile}
          className="shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-300/60"
        >
          {info?.pictureURL ? (
            <img
              src={info.pictureURL as string}
              alt=""
              className="w-11 h-11 rounded-full object-cover border border-lime-300/50 cursor-pointer"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-slate-700" />
          )}
        </button>

        <div className="flex-1">
          <p
            onClick={handleGoToProfile}
            className="text-sm font-semibold leading-tight cursor-pointer hover:text-lime-200"
          >
            {info
              ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
              : "Traveller Pro"}
          </p>
          <p className="text-[11px] text-slate-400">
            {user?.email ?? "online"}
          </p>
        </div>

        <button
          className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm hover:bg-slate-700"
          title="Notifications"
        >
          ●
        </button>
      </div>

      {/* calendar */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-slate-300">OCTOBER 2025</p>
          <div className="flex gap-1">
            <button className="text-xs px-2 py-1 bg-slate-800 rounded">
              {"<"}
            </button>
            <button className="text-xs px-2 py-1 bg-slate-800 rounded">
              {">"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-[10px] text-center text-slate-400 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-[10px] text-center">
          {Array.from({ length: 30 }).map((_, i) => {
            const day = i + 1;
            const isToday = day === new Date().getDate();
            return (
              <span
                key={day}
                className={`py-1 rounded ${
                  isToday
                    ? "bg-lime-400 text-slate-900 font-semibold"
                    : "bg-slate-800/40 text-slate-200"
                }`}
              >
                {day}
              </span>
            );
          })}
        </div>
      </div>

      {/* bookings / right cards */}
      <div className="px-4 mt-2 flex-1 overflow-y-auto pb-4 space-y-3">
        {/* ... resto identico ... */}
      </div>
    </aside>
  );
};

export default RightPanel;

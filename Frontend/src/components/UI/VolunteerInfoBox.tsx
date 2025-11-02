import { useAuth } from "@/context";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getUserDetails } from "@/data";

const VolunteerInfoBox = () => {
  const { user, handleSignOut } = useAuth();
  const navigate = useNavigate();
  const [info, setInfo] = useState<UserProfileData | null>(null);

  useEffect(() => {
    if (!user?._id) return;
    (async () => {
      try {
        const data = await getUserDetails(user._id);
        const profile = data?.userProfiles?.[0];
        if (profile) setInfo(profile);
      } catch (err) {
        console.error("Error fetching volunteer info:", err);
      }
    })();
  }, [user?._id]);

  const handleGoToProfile = () => {
    navigate("/volunteerAccount");
  };

  if (!user) return null;

  return (
    <div
      className={`
        /* mobile: dentro il flow */
        w-full max-w-full bg-white border border-slate-200 shadow-sm rounded-md
        px-3 py-2 mb-4 flex items-center gap-3
        /* desktop: torna assoluto in alto a destra */
        md:absolute md:top-3 md:right-6 md:w-auto md:max-w-[200px] md:shadow-md
      `}
    >
      {info?.pictureURL ? (
        <img
          src={info.pictureURL as string}
          alt="Volunteer"
          className="w-9 h-9 md:w-10 md:h-10 rounded-md object-cover border border-slate-200 cursor-pointer"
          onClick={handleGoToProfile}
        />
      ) : (
        <div
          onClick={handleGoToProfile}
          className="w-9 h-9 md:w-10 md:h-10 rounded-md bg-slate-200 cursor-pointer"
        />
      )}

      <div className="flex-1 min-w-0">
        <p
          onClick={handleGoToProfile}
          className="text-sm font-semibold text-slate-900 cursor-pointer hover:text-sky-600 truncate"
        >
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-xs text-slate-500 truncate">{user?.email}</p>

        <button
          onClick={handleSignOut}
          className="mt-2 w-full text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-sm py-1.5 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default VolunteerInfoBox;

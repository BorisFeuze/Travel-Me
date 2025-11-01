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
    <div className="absolute top-6 right-6 flex items-center gap-3 bg-white border border-slate-200 shadow-md rounded-md px-4 py-2">
      {info?.pictureURL ? (
        <img
          src={info.pictureURL as string}
          alt="Volunteer"
          className="w-10 h-10 rounded-md object-cover border border-slate-200 cursor-pointer"
          onClick={handleGoToProfile}
        />
      ) : (
        <div
          onClick={handleGoToProfile}
          className="w-10 h-10 rounded-md bg-slate-200 cursor-pointer"
        />
      )}

      <div className="flex flex-col w-full max-w-[160px]">
        <p
          onClick={handleGoToProfile}
          className="text-sm font-semibold text-slate-900 cursor-pointer hover:text-sky-600"
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

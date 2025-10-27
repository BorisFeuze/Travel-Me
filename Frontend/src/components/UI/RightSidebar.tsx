import { useEffect, useState } from "react";
import { getUserDetails } from "@/data";
import avatar_icon from "../../assets/images/Chat/avatar_icon.png";

const RightSidebar = ({ selectedUser, onlineUsers }) => {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserDetails(selectedUser._id);
        if (data) {
          // console.log(data);

          const userInfo = data.userProfiles[0];

          // console.log(userInfo);

          setInfo(userInfo);
        }
      } catch {
        setError("Error fetching userProfile of Host");
      }
    })();
  }, [selectedUser]);

  return (
    selectedUser && (
      <div
        className={`bg-[#8185B2]/10 text-black w-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden" : ""}`}
      >
        <div className="pt-16 flex flex-col items-center justify-center gap-2 text-xs font-light mx-auto">
          <img
            src={info?.pictureURL[0] || avatar_icon}
            alt=""
            className="w-20 aspect-square rounded-full"
          />
          <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
            {onlineUsers.includes(selectedUser._id) && (
              <p className="w-2 h-2 rounded-full bg-green-500"></p>
            )}
            {selectedUser.firstName} {selectedUser.lastName}
          </h1>
          <p className="px-10 mx-auto">{info?.gender}</p>
          <p className="px-10 mx-auto">
            {info?.country}/{info?.continent}
          </p>
        </div>
        <hr className="border-black my-4" />
        {/* <div className="px-5 text-xs">
          <p>Media</p>
          <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
            {imageDummyData.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="cursor-pointer rounded"
              >
                <img src={url} alt="" className="h-full rounded-md" />
              </div>
            ))}
          </div>
        </div> */}

        <button className="absolute bottom-5 left-0.5 transform -translate-x-0.5 bg-linear-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-2 rounded-full w-full cursor-pointer">
          Logout
        </button>
      </div>
    )
  );
};

export default RightSidebar;

import { useEffect, useState } from "react";
import { getUserDetails } from "@/data";
import avatarPlaceholder from "@/assets/images/avatarPlaceholder.png";

type CardHostType = {
  _id: string;
  firstName: string;
  email: string;
};

const CardHost = ({ _id, firstName, email }: CardHostType) => {
  const [info, setInfo] = useState<UserProfileData | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserDetails(_id);

        // console.log(data);

        const userInfo = data?.userProfiles[0];

        if (userInfo) {
          // console.log(userInfo);

          setInfo(userInfo);
        }
      } catch {
        // setError("Error fetching top hosts");
      } finally {
        // setLoading(false);
      }
    })();
  }, []);

  // console.log(info.pictureURL);

  return (
    <>
      <div className="mx-auto mb-2 grid h-16 w-16 place-items-center rounded-full border bg-slate-50 text-sm font-semibold">
        {info?.pictureURL ? (
          <img
            src={info.pictureURL as string}
            alt={`${firstName}`}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <img
            src={avatarPlaceholder}
            className="h-16 w-16 rounded-full object-cover"
          ></img>
        )}
      </div>
      <div className="text-sm font-medium">{firstName}</div>
      <div className="text-xs text-slate-500">
        {info?.continent}, {info?.country}
      </div>
    </>
  );
};

export default CardHost;

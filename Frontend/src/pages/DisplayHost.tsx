import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getUsers, getUserDetails } from "@/data";
import { useAuth } from "@/context";

const DisplayHost = () => {
  const { id } = useParams<{ id: string }>();
  const [host, setHost] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<UserProfileFormData | null>(null);

  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (!id) {
        setError("No host ID provided.");
        setLoading(false);
        return;
      }
      try {
        // mock: fetch a bigger list and find by id
        const dataUsers = await getUsers();

        // console.log(dataUsers);

        const allHosts = dataUsers.users.filter((u: User) =>
          u.roles?.includes("host")
        );
        // console.log(allHosts);
        // const allHosts = await UsersAPI.getTopHosts(100);
        const found = allHosts.find((h: User) => h._id === id) ?? null;

        // console.log(found);
        if (!found) setError("Host not found.");
        setHost(found);
      } catch {
        setError("Failed to load host details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!id) {
      setError("Invalid user id.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const data = await getUserDetails(id);

        if (!data) {
          return null;
        }

        const userInfo = data?.userProfiles[0];

        if (userInfo) {
          // console.log(userInfo);

          setInfo(userInfo);
        }
      } catch {
        setError("Error fetching userProfile of Host");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-error">
        {error}
      </div>
    );
  if (!host)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Host not found
      </div>
    );

  // // small helpers
  // const fullName = `${host.firstName ?? ""} ${host.lastName ?? ""}`.trim();
  // const address =
  //   host.addressLine ??
  //   `${host.city ?? ""}${host.city ? ", " : ""}${host.country ?? ""}`;

  return (
    <div className="bg-base-100 rounded-2xl shadow-sm p-6 md:p-8">
      {/* Header: 2 cols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center mb-6">
        {/* Left: avatar + greeting */}
        <div className="flex items-center gap-4">
          <div className="h-80 w-80 rounded-2xl border bg-slate-100 flex items-center justify-center overflow-hidden">
            {info?.pictureURL ? (
              <img
                src={info?.pictureURL as string}
                alt={host?.firstName || "Host avatar"}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-lg">Profile</span>
            )}
          </div>
          <div className="inline-flex flex-col">
            <div className="text-2xl md:text-3xl font-bold text-slate-900">
              Hey, {host.firstName}
              {host.firstName ? "!" : ""}
            </div>
          </div>
        </div>

        {/* Right: gender checkboxes */}
        <div className="flex items-center justify-start md:justify-end gap-6">
          {(["male", "female", "others"] as const).map((g) => (
            <label key={g} className="flex items-center gap-2 cursor-default">
              <span className="text-slate-800 capitalize">{g}</span>
              <input
                type="checkbox"
                readOnly
                checked={info?.gender === g}
                className="checkbox checkbox-sm"
                aria-label={`gender ${g}`}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="divider my-2" />

      {/* Details: 2 cols on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Description */}
          <div>
            <div className="text-slate-800 font-semibold mb-2">Description</div>
            <textarea
              readOnly
              className="textarea textarea-bordered w-full h-28"
              value={
                info?.description ??
                "Ciao, I have more than 20 years professional artist renovation holder in Italy."
              }
            />
          </div>

          {/* Needs / Required skills */}
          <div>
            <div className="text-slate-800 font-semibold mb-2">
              Required skills
            </div>
            <div className="rounded-xl px-4 py-3 bg-green-200/80 text-slate-900 space-y-2">
              {/* Show skills list if present */}
              {Array.isArray(info?.skills) && info?.skills.length > 0 && (
                <>
                  <p className="font-semibold">Keyskills</p>
                  <div className="flex flex-wrap gap-2">
                    {info?.skills.map((s) => (
                      <span key={s} className="badge badge-outline">
                        {s}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {/* <p>
                I need one nice volunteer do renovation work for me in my art
                studio for half a year.
              </p> */}{" "}
              {/* Placeholder if no needs/skills */}
              <p className="text-gray-500">
                No specific needs or skills required at the moment.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Address */}
          <div>
            <div className="text-slate-800 font-semibold mb-2">Address</div>
            <input
              readOnly
              className="input input-bordered w-full"
              value={info?.adresse}
            />
          </div>

          {/* Language */}
          <div>
            <div className="text-slate-800 font-semibold mb-2">Language</div>
            <input
              readOnly
              className="input input-bordered w-full"
              value={
                info?.languages?.length
                  ? info?.languages.join(", ")
                  : "italian, english, german"
              }
            />
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Contact</h3>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {host.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Phone:</span> {host.phoneNumber}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Age:</span> {info?.age}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2">
            <button
              onClick={() =>
                user
                  ? navigate(`/chat`)
                  : navigate(`/login?redirect=/job/${job._id}`)
              }
              className="btn btn-primary"
            >
              Chat me directly
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DisplayHost;

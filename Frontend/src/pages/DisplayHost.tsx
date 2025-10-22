import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UsersAPI, type User } from "@/library/usersMock";

const DisplayHost = () => {
  const { id } = useParams<{ id: string }>();
  const [host, setHost] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!id) {
        setError("No host ID provided.");
        setLoading(false);
        return;
      }
      try {
        // mock: fetch a bigger list and find by id
        const allHosts = await UsersAPI.getTopHosts(100);
        const found = allHosts.find((h) => h.id === id) ?? null;
        if (!found) setError("Host not found.");
        setHost(found);
      } catch {
        setError("Failed to load host details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

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

  // small helpers
  const fullName = `${host.firstName ?? ""} ${host.lastName ?? ""}`.trim();
  const address =
    host.addressLine ??
    `${host.city ?? ""}${host.city ? ", " : ""}${host.country ?? ""}`;

  return (
    <div className="bg-green-50 rounded-2xl shadow-sm p-6 md:p-8">
      {/* Header: 2 cols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center mb-6">
        {/* Left: avatar + greeting */}
        <div className="flex items-center gap-4">
          <div className="h-28 w-28 rounded-2xl border bg-slate-50 flex items-center justify-center overflow-hidden">
            {host.pictureURL ? (
              <img
                src={host.pictureURL}
                alt={fullName || "Host avatar"}
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
                checked={host.gender === g}
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
                (host as any).description ??
                "Ciao, I have more than 20 years professional artist renovation holder in Italy."
              }
            />
          </div>

          {/* Needs / Required skills */}
          <div>
            <div className="text-slate-800 font-semibold mb-2">
              Needs / Required skills
            </div>
            <div className="rounded-xl px-4 py-3 bg-green-200/80 text-slate-900 space-y-2">
              {/* Show needs if present */}
              {host.needs && (
                <p>
                  <span className="font-semibold">Need: </span>
                  {host.needs}
                </p>
              )}
              {/* Show skills list if present */}
              {Array.isArray(host.skills) && host.skills.length > 0 && (
                <>
                  <p className="font-semibold">Keyskills</p>
                  <div className="flex flex-wrap gap-2">
                    {host.skills.map((s) => (
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
              value={address}
            />
          </div>

          {/* Language */}
          <div>
            <div className="text-slate-800 font-semibold mb-2">Language</div>
            <input
              readOnly
              className="input input-bordered w-full"
              value={
                host.languages?.length
                  ? host.languages.join(", ")
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
                <span className="font-medium">Phone:</span> {host.phone}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Age:</span> {host.age}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2">
            <button className="btn btn-primary">Chat me directly</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DisplayHost;

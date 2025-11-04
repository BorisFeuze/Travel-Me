import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import {
  ArrowLeft,
  MapPin,
  Globe2,
  CalendarDays,
  UserCircle2,
  NotebookText,
  Wrench,
  Mail,
  Phone,
  Lightbulb,
  GraduationCap,
} from "lucide-react";

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
    <div className="bg-base-100 rounded-3xl shadow-sm ring-1 ring-base-200/70 p-6 md:p-8">
      {/* Back button (top-left) */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm md:btn-md rounded-full gap-2 text-base-content/70 hover:text-base-content"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">Back</span>
        </button>
      </div>

      {/* HEADER */}
      <div className="flex flex-col xl:flex-row items-start gap-6 xl:items-center">
        {/* Avatar */}
        <div className="flex-shrink-0 mx-auto xl:mx-0">
          <div className="size-40 md:size-52 rounded-full border border-base-300 bg-base-200 overflow-hidden flex items-center justify-center ring-4 ring-base-100 shadow-md">
            {info?.pictureURL ? (
              <img
                src={info.pictureURL as string}
                alt={host?.firstName || "Host avatar"}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserCircle2 className="w-16 h-16 text-base-content/50" />
            )}
          </div>
        </div>

        {/* Text & Quick Info */}
        <div className="flex flex-col w-full gap-5">
          {/* Name + gender */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-3xl md:text-5xl font-bold text-base-content leading-tight flex items-center gap-2">
              <UserCircle2 className="w-6 h-6 text-primary" />
              {[host.firstName, host.lastName].filter(Boolean).join(" ") ||
                "Host"}
            </h1>

            <div className="flex flex-wrap gap-2">
              {(["male", "female", "others"] as const).map((g) => {
                const active = info?.gender === g;
                return (
                  <span
                    key={g}
                    className={[
                      "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm capitalize border transition",
                      active
                        ? "bg-primary text-primary-content border-primary shadow-sm"
                        : "bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200/60",
                    ].join(" ")}
                  >
                    <UserCircle2
                      className={`w-4 h-4 ${
                        g === "female"
                          ? "text-pink-500"
                          : g === "others"
                            ? "text-indigo-500"
                            : ""
                      }`}
                    />
                    {g}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Address / Language / Age row / education */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl ring-1 ring-base-200 bg-base-100 p-4 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] uppercase tracking-wide text-base-content/60">
                  Address
                </p>
                <p className="text-base">{info?.address || "—"}</p>
              </div>
            </div>

            <div className="rounded-2xl ring-1 ring-base-200 bg-base-100 p-4 flex items-start gap-3">
              <Globe2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] uppercase tracking-wide text-base-content/60">
                  Languages
                </p>
                <p className="text-base">
                  {info?.languages?.length
                    ? info.languages.join(", ")
                    : "english, german"}
                </p>
              </div>
            </div>

            {/* ✅ Education (new) */}
            <div className="rounded-2xl ring-1 ring-base-200 bg-base-100 p-4 flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] uppercase tracking-wide text-base-content/60">
                  Education
                </p>
                <p className="text-base">{info?.educations || "—"}</p>
              </div>
            </div>

            <div className="rounded-2xl ring-1 ring-base-200 bg-base-100 p-4 flex items-start gap-3">
              <CalendarDays className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] uppercase tracking-wide text-base-content/60">
                  Age
                </p>
                <p className="text-base">{info?.age ?? "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT */}
        <div className="flex flex-col gap-6">
          {/* Description */}
          <section className="rounded-2xl ring-1 ring-base-200 bg-base-100 p-5">
            <header className="flex items-center gap-2 mb-3">
              <NotebookText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Description</h2>
            </header>
            <textarea
              placeholder="Host Description"
              readOnly
              className="textarea textarea-bordered w-full min-h-36 text-base"
              value={
                info?.description ??
                "Ciao, I have more than 20 years professional artist renovation holder in Italy."
              }
            />
          </section>

          {/* Required skills */}
          <section className="rounded-2xl ring-1 ring-base-200 bg-base-100 p-5">
            <header className="flex items-center gap-2 mb-3">
              <Wrench className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Required skills</h2>
            </header>
            {Array.isArray(info?.skills) && info.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {info.skills.map((s) => (
                  <span
                    key={s}
                    className="badge badge-outline border-base-300 text-base-content/80 text-sm px-3 py-2 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-base-content/60 text-sm">
                No specific needs or skills required at the moment.
              </p>
            )}
          </section>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-6">
          {/* Contact */}
          <section className="rounded-2xl ring-1 ring-base-200 bg-base-100 p-5">
            <header className="flex items-center gap-2 mb-3">
              <Mail className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Contact</h2>
            </header>

            <div className="space-y-2 text-base">
              <p className="text-base-content/80 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary/70" /> {host.email}
              </p>
              <p className="text-base-content/80 flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary/70" /> {host.phoneNumber}
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => (user ? navigate(`/chat`) : navigate(`/login`))}
                className="btn btn-primary w-full h-14 rounded-2xl gap-2 transition-transform hover:scale-[1.02]"
              >
                <MessageSquare className="w-5 h-5" />
                {user ? "Contact" : "Login to contact"}
              </button>
            </div>
          </section>

          {/* Tip */}
          <div className="rounded-2xl bg-base-200/60 border border-base-300 p-4 text-sm text-base-content/80 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary/80" />
            <span>
              Tip: Ask about tasks, accommodation, and working hours via chat.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DisplayHost;

import { Link, useLocation } from "react-router";
import { useAuth, useUser } from "@/context";
import logo from "../../assets/images/pngwing.com.png";

const Sidebar = () => {
  const { signedIn, handleSignOut, user } = useAuth();
  const { allUsers } = useUser();
  const location = useLocation();

  const currUserProfile = allUsers.find((u: UserProfileData) => {
    return u.userId === user?._id;
  });

  // helper per evidenziare la voce attiva
  const isActive = (path: string) => location.pathname === path;

  return (
    // wrapper sidebar
    <aside
      className="
        fixed top-0 left-0 h-screen w-60
        bg-white border-r border-gray-200
        flex flex-col
        z-50
      "
    >
      {/* header logo */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
        <img src={logo} alt="TravelMe Logo" className="h-10 w-auto m-auto" />
      </div>

      {/* menu */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
        <Link
          to="/"
          className={`
            flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium
            transition
            ${isActive("/") ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}
          `}
        >
          {/* qui potresti mettere un'icona */}
          <span>Home</span>
        </Link>

        {signedIn && (
          <Link
            to="/chat"
            className={`
              flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium
              transition
              ${isActive("/chat") ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}
            `}
          >
            <span>Chat</span>
          </Link>
        )}

        {signedIn && (
          <Link
            to={
              user?.roles?.[0] === "host" ? "/hostAccount" : "/volunteerAccount"
            }
            className={`
              flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium
              transition
              ${
                isActive(
                  user?.roles?.[0] === "host"
                    ? "/hostAccount"
                    : "/volunteerAccount"
                )
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            <span>Profile</span>
          </Link>
        )}
      </nav>

      {/* footer / user area */}
      <div className="px-4 py-4 border-t border-gray-100 mt-auto">
        {signedIn ? (
          <div className="flex items-center gap-3">
            {currUserProfile?.pictureURL ? (
              <img
                src={currUserProfile.pictureURL as string}
                alt="User"
                className="w-10 h-10 rounded-full object-cover border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200" />
            )}

            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">
                {user?.firstName || "User"}
              </p>
              <button
                onClick={handleSignOut}
                className="text-xs text-red-500 hover:text-red-600"
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="w-full inline-flex items-center justify-center
                       px-4 py-2 rounded-xl bg-blue-600 text-white text-sm
                       font-semibold hover:bg-blue-700 transition"
          >
            Login
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

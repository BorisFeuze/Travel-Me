import { Link, useLocation } from "react-router";
import { useAuth } from "@/context";
import logo from "@/assets/images/pngwing.com.png";

const Sidebar = () => {
  const { signedIn, user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
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
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
            isActive("/")
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Home
        </Link>

        {signedIn && (
          <Link
            to="/chat"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
              isActive("/chat")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Chat
          </Link>
        )}

        {signedIn && (
          <Link
            to={
              user?.roles?.[0] === "host" ? "/hostAccount" : "/volunteerAccount"
            }
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
              isActive(
                user?.roles?.[0] === "host"
                  ? "/hostAccount"
                  : "/volunteerAccount"
              )
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Profile
          </Link>
        )}
      </nav>

      {/* footer */}
      <div className="px-4 py-4 border-t border-gray-100 mt-auto">
        {!signedIn ? (
          <Link
            to="/login"
            className="w-full inline-flex items-center justify-center
                       px-4 py-2 rounded-xl bg-black text-white text-sm
                       font-semibold hover:bg-pink-600 transition"
          >
            Login
          </Link>
        ) : null}
      </div>
    </aside>
  );
};

export default Sidebar;

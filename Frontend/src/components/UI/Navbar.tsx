import { Link } from "react-router";
import { useAuth } from "@/context";
import Searchbar from "./Searchbar";

const Navbar = () => {
 const { signedIn, handleSignOut, user } = useAuth();

  return (
    <div className="navbar bg-base-100 shadow-sm px-6">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl font-bold">
          TravelMe
        </Link>
      </div>

      <div className="flex-none">
        <div className="mx-4 w-64 md:w-96">
          <Searchbar />
        </div>
      </div>

      <div className="flex-none">
        {!signedIn ? (
          <Link to="/login" className="btn btn-outline btn-primary ml-2">
            Sign In
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/chat" className="btn btn-ghost">
              Chat
            </Link>
            
            {user?.roles[0] === "host" ? (
            <Link to="/hostAccount" className="btn btn-ghost">Profile</Link>
            ) : (
            <Link to="/volunteerAccount" className="btn btn-ghost">Profile</Link>
            )}

            <button
              onClick={handleSignOut}
              className="btn btn-outline btn-error ml-2"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
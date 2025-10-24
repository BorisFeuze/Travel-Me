import { Link } from "react-router";
import { useAuth } from "@/context";
import Searchbar from "./Searchbar";
import logo from "../../assets/images/pngwing.com.png"; 

const Navbar = () => {
  const { signedIn, handleSignOut, user } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div
        className="max-w-[100rem] mx-auto mt-3
                   flex items-center justify-between gap-3
                   px-4 sm:px-6 py-3
                   rounded-2xl
                   bg-white/70 dark:bg-neutral-900/30
                   backdrop-blur-lg backdrop-saturate-150
                   border border-black/80 shadow-md
                   transition-all duration-300"
      >
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="hover:opacity-80 transition">
            Home
          </Link>
          <Link to="/explore" className="hover:opacity-80 transition">
            Explore
          </Link>
          <Link to="/about" className="hover:opacity-80 transition">
            About
          </Link>
          <Link to="/contact" className="hover:opacity-80 transition">
            Contact
          </Link>
        </nav>

        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
        >
          <img
            src={logo}
            alt="TravelMe Logo"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Searchbar
          <div className="hidden md:block w-40 lg:w-64">
            <Searchbar />
          </div> */}

          {signedIn ? (
            <>
              <Link
                to="/chat"
                className="px-3 py-2 text-sm font-medium hover:opacity-80 transition"
              >
                Chat
              </Link>

              {user?.roles?.[0] === "host" ? (
                <Link
                  to="/hostAccount"
                  className="px-3 py-2 text-sm font-medium hover:opacity-80 transition"
                >
                  Profile
                </Link>
              ) : (
                <Link
                  to="/volunteerAccount"
                  className="px-3 py-2 text-sm font-medium hover:opacity-80 transition"
                >
                  Profile
                </Link>
              )}

              <button
                onClick={handleSignOut}
                className="px-4 sm:px-5 py-2 text-sm font-semibold rounded-full
                           bg-neutral-900 text-white dark:bg-white dark:text-neutral-900
                           hover:opacity-90 active:opacity-100 transition"
              >
                Sign Out
              </button>

              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt="User"
                  className="w-9 h-9 object-cover"
                />
              )}
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 sm:px-5 py-2 text-sm font-semibold rounded-full
                         bg-neutral-900 text-white dark:bg-white dark:text-neutral-900
                         hover:opacity-90 active:opacity-100 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
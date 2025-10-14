// Navbar.jsx
import { NavLink } from "react-router";
import logo from "../../assets/pokemon-logo-png-1446.png";
import { useAuthor } from "@/context";

const Navbar = () => {
  const { signedIn, handleSignOut } = useAuthor();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "px-4 py-2 rounded-full bg-yellow-400 border-2 border-gray-700  text-black font-semibold transition-transform transform hover:scale-105"
      : "px-4 py-2 rounded-full hover:bg-yellow-300 transition-transform transform hover:scale-105";

  return (
    <>
      <div className="bg-yellow-200 shadow-lg rounded-[4rem] border-2 border-gray-700 px-6 py-2 flex justify-between items-center max-w-6xl mx-auto fixed top-2 left-0 right-0 z-50">
        {/* Link a sinistra */}
        <ul className="flex gap-6 items-center">
          <li>
            <NavLink to="/" className={linkClass}>
              HOME
            </NavLink>
          </li>
          <li>
            <NavLink to="/battle" className={linkClass}>
              BATTLE
            </NavLink>
          </li>
        </ul>

        {/* Logo al centro */}
        <NavLink to="/" className="mx-6">
          <img
            src={logo}
            alt="Pokemon Logo"
            className="w-40 h-20 object-contain drop-shadow-lg transition-transform transform hover:scale-110"
          />
        </NavLink>

        {/* Link a destra */}
        <ul className="flex gap-6 items-center">
          <li>
            <NavLink to="/leaderboard" className={linkClass}>
              LEADEBOARD
            </NavLink>
          </li>
          {!signedIn ? (
            <>
              <li>
                <NavLink to="/register" className={linkClass}>
                  REGISTER
                </NavLink>
              </li>
              <li>
                <NavLink to="/login" className={linkClass}>
                  LOGIN
                </NavLink>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-full bg-yellow-400 text-white font-semibold transition-transform transform hover:scale-105"
              >
                LOGOUT
              </button>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;

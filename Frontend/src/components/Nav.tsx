import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCallback } from "react";

export default function Nav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const linkCls = (p: string) =>
    `px-3 py-2 rounded-lg font-medium hover:bg-slate-100 ${
      pathname === p ? "bg-slate-200 aria-[current=page]:bg-slate-200" : ""
    }`;

  const handleLogout = useCallback(() => {
    // TODO: import your real logout
    // await logout();
    navigate("/", { replace: true }); // or navigate("/login")
  }, [navigate]);

  return (
    <div
      role="navigation"
      aria-label="Main"
      className="h-16 flex items-center justify-between px-4"
    >
      <Link to="/" className="font-bold">
        Travel Me
      </Link>

      <nav className="flex items-center gap-2">
        <Link
          to="/"
          className={linkCls("/")}
          aria-current={pathname === "/" ? "page" : undefined}
        >
          Home
        </Link>

        <Link
          to="/login"
          className={linkCls("/login")}
          aria-current={pathname === "/login" ? "page" : undefined}
        >
          Login
        </Link>

        <Link
          to="/register"
          className={linkCls("/register")}
          aria-current={pathname === "/register" ? "page" : undefined}
        >
          Register
        </Link>

        {/* Example logout button if user is logged in */}
        <button
          type="button"
          onClick={handleLogout}
          className="px-3 py-2 rounded-lg font-medium hover:bg-slate-100"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}

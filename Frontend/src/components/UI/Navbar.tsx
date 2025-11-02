import { Link, useLocation } from "react-router";
import { useAuth } from "@/context";
import { Home, MessageSquare, User, LogIn } from "lucide-react";
import logo from "@/assets/images/pngwing.com.png";

const Sidebar = () => {
  const { signedIn, user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className="
        fixed top-0 left-0 h-screen w-[100px]
        bg-white border-r border-gray-200
        flex flex-col items-center
        py-4 gap-4
        z-50
      "
    >
      {/* Logo */}
      <div className="p-2 mb-4">
        <img src={logo} alt="TravelMe Logo" className="h-9 w-auto" />
      </div>

      {/* Menu icons */}
      <nav className="flex flex-col items-center gap-4 flex-1">
        <SidebarLink
          to="/"
          icon={<Home className="w-5 h-5" />}
          active={isActive("/")}
          label="Home"
        />

        {signedIn && (
          <SidebarLink
            to="/chat"
            icon={<MessageSquare className="w-5 h-5" />}
            active={isActive("/chat")}
            label="Chat"
          />
        )}

        {signedIn && (
          <SidebarLink
            to={
              user?.roles?.[0] === "host" ? "/hostAccount" : "/volunteerAccount"
            }
            icon={<User className="w-5 h-5" />}
            active={isActive(
              user?.roles?.[0] === "host" ? "/hostAccount" : "/volunteerAccount"
            )}
            label="Profile"
          />
        )}
      </nav>

      {/* Footer: login if not signed in */}
      {!signedIn && (
        <div className="pb-4">
          <SidebarLink
            to="/login"
            icon={<LogIn className="w-5 h-5" />}
            active={isActive("/login")}
            label="Login"
          />
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

/* 🔹 Component per singolo link (con tooltip) */
type SidebarLinkProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
};

const SidebarLink = ({ to, icon, label, active }: SidebarLinkProps) => (
  <div className="relative group">
    <Link
      to={to}
      className={`
        flex items-center justify-center
        w-10 h-10 rounded-xl
        transition-colors duration-200
        ${
          active
            ? "bg-blue-50 text-blue-600"
            : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
        }
      `}
    >
      {icon}
    </Link>

    {/* Tooltip */}
    <span
      className="
        absolute left-14 top-1/2 -translate-y-1/2
        bg-gray-800 text-white text-xs rounded-md px-2 py-1
        opacity-0 group-hover:opacity-100
        pointer-events-none whitespace-nowrap
        transition-opacity duration-200
      "
    >
      {label}
    </span>
  </div>
);

import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/context";
import { Home, MessageSquare, User, LogIn, Menu, X } from "lucide-react";
import logo from "@/assets/images/chatgpt_image_3._nov._2025__15_34_38-removebg-preview.png";

const Sidebar = () => {
  const { signedIn, user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* 🔹 Bottone menu per schermi piccoli */}
      <button
        className="
          fixed top-4 left-4
          flex items-center justify-center
          w-10 h-10 rounded-full
          bg-white shadow-md border border-gray-200
          z-[60]              /* ⬅️ più alto della sidebar */
          md:hidden
        "
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* 🔹 Overlay scuro quando il menu è aperto su mobile */}
      {isOpen && (
        <div
          className="
            fixed inset-0 bg-black/30
            z-40               /* ⬅️ sotto la sidebar e sotto il bottone */
            md:hidden
          "
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-[100px]
          bg-white border-r border-gray-200
          flex flex-col items-center
          py-4 gap-4
          z-50               /* ⬅️ la sidebar resta sotto il bottone */
          transform transition-transform duration-200
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="p-2 mt-6 mb-4">
          <img src={logo} alt="TravelMe Logo" className="h-20 w-auto" />
        </div>

        {/* Menu icons */}
        <nav className="flex flex-col items-center mb-40 justify-center gap-4 flex-1">
          <SidebarLink
            to="/"
            icon={<Home className="w-5 h-5" />}
            active={isActive("/")}
            label="Home"
            onClick={() => setIsOpen(false)}
          />

          {signedIn && (
            <SidebarLink
              to="/chat"
              icon={<MessageSquare className="w-5 h-5" />}
              active={isActive("/chat")}
              label="Chat"
              onClick={() => setIsOpen(false)}
            />
          )}

          {signedIn && (
            <SidebarLink
              to={
                user?.roles?.[0] === "host"
                  ? "/hostAccount"
                  : "/volunteerAccount"
              }
              icon={<User className="w-5 h-5" />}
              active={isActive(
                user?.roles?.[0] === "host"
                  ? "/hostAccount"
                  : "/volunteerAccount"
              )}
              label="Profile"
              onClick={() => setIsOpen(false)}
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
              onClick={() => setIsOpen(false)}
            />
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;

/* 🔹 Component per singolo link (con tooltip) */
type SidebarLinkProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

const SidebarLink = ({
  to,
  icon,
  label,
  active,
  onClick,
}: SidebarLinkProps) => (
  <div className="relative group">
    <Link
      to={to}
      onClick={onClick}
      className={`
        flex items-center justify-center
        w-10 h-10 rounded-xl
        transition-colors duration-200
        ${
          active
            ? "bg-gray-50 text-pink-600"
            : "text-gray-600 hover:bg-gray-100 hover:text-pink-600"
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

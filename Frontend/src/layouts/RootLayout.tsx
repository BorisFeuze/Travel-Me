import { Outlet, useLocation } from "react-router";
import { ToastContainer } from "react-toastify";
import { AuthProvider, UserProvider, useAuth } from "@/context";
import TopNav from "@/components/UI/Navbar";
import RightPanel from "@/components/UI/RightPanel";
import VolunteerInfoBox from "@/components/UI/VolunteerInfoBox";
import { useState } from "react";

const RootLayout = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <LayoutContent />
      </UserProvider>
    </AuthProvider>
  );
};

const LayoutContent = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [isRightOpen, setIsRightOpen] = useState(true);

  const { user } = useAuth();
  const role = Array.isArray(user?.roles) ? user!.roles[0] : undefined;
  const isHost = role === "host";

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar sinistra */}
      <aside
        className="
          hidden sm:flex sm:flex-col
          w-60 min-w-60
          border-r border-gray-200 bg-white
          shrink-0
        "
      >
        <TopNav />
      </aside>

      {/* Contenuto centrale */}
      <main
        className="
          flex-1 overflow-y-auto
          bg-white px-6 py-8
          relative
        "
      >
        <div className="max-w-6xl mx-auto relative">
          {!isHost && <VolunteerInfoBox />}
          <Outlet />
        </div>
      </main>

      {/* Pannello destro: solo host in home */}
      {isHome && isHost && (
        <RightPanel
          isOpen={isRightOpen}
          onToggle={() => setIsRightOpen((p) => !p)}
        />
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={1500}
        theme="colored"
      />
    </div>
  );
};

export default RootLayout;

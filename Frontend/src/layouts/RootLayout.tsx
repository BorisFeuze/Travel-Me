import { Outlet, useLocation } from "react-router";
import { ToastContainer } from "react-toastify";
import { AuthProvider, UserProvider, useAuth } from "@/context";
import RightPanel from "@/components/UI/RightPanel";
import VolunteerInfoBox from "@/components/UI/VolunteerInfoBox";
import Sidebar from "@/components/UI/Navbar";
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
    <>
      {/* 👇 sidebar fissa e stretta */}
      <Sidebar />

      <div className="flex h-screen bg-white overflow-hidden">
        {/* 👇 spazio per la sidebar: stessa larghezza della sidebar */}
        <main
          className="
            flex-1 overflow-y-auto bg-white relative 
            pl-[72px]   /* larghezza sidebar */
          "
        >
          {/* padding interno lo gestisci tu */}
          <div className="relative w-[95%] m-auto p-7 sm:p-10 lg:p-16 ">
            {isHome && !isHost && <VolunteerInfoBox />}
            <Outlet />
          </div>
        </main>

        {/* pannello destro solo host in home */}
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
    </>
  );
};

export default RootLayout;

import { Outlet, useLocation } from "react-router";

import { ToastContainer } from "react-toastify";
import { AuthProvider, UserProvider } from "@/context";
import Navbar from "@/components/UI/Navbar";
import RightPanel from "@/components/UI/RightPanel";

const RootLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === "/"; // 👈 solo nella home 3 colonne

  return (
    <AuthProvider>
      <UserProvider>
        <div
          className={`grid h-screen overflow-hidden ${
            isHome
              ? "grid-cols-[240px_1fr_320px]" // home
              : "grid-cols-[240px_1fr]" // tutte le altre pubbliche
          }`}
        >
          {/* Sidebar */}
          <aside className="bg-white border-r border-gray-200 overflow-y-auto">
            <ToastContainer
              position="bottom-right"
              autoClose={1500}
              theme="colored"
            />
            <Navbar />
          </aside>

          {/* Main */}
          <main className="bg-white  overflow-y-auto">
            <div className="max-w-full p-10 mx-auto ">
              <Outlet />
            </div>
          </main>

          {/* RightPanel solo nella home */}
          {isHome && (
            <aside className=" bg-slate-900/80 border-l border-slate-800 overflow-y-auto">
              <RightPanel />
            </aside>
          )}
        </div>
      </UserProvider>
    </AuthProvider>
  );
};

export default RootLayout;

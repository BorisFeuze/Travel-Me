import { Outlet } from "react-router";
import { Navbar } from "@/components/UI";
import { ToastContainer } from "react-toastify";
import { AuthProvider, UserProvider } from "@/context";

const RootLayout = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={1500}
          theme="colored"
        />
        <Navbar />
        <div className="pt-12">
          <Outlet />
        </div>
      </UserProvider>
    </AuthProvider>
  );
};

export default RootLayout;

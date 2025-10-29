import { Outlet } from "react-router";
import { Navbar } from "@/components/UI";
import { AuthProvider, UserProvider } from "@/context";

const RootLayout = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <Navbar />
        <div className="pt-12">
          <Outlet />
        </div>
      </UserProvider>
    </AuthProvider>
  );
};

export default RootLayout;

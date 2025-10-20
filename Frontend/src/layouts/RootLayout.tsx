import { Outlet } from "react-router";
import { Navbar } from "@/components/UI";
import { AuthProvider } from "@/context";

const RootLayout = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Outlet />
    </AuthProvider>
  );
};

export default RootLayout;

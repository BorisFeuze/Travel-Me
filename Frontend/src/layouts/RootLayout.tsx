import { Outlet } from "react-router";
import Navbar from "../components/UI/Navbar";
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


import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/UI/Navbar";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context";

const RootLayout = () => {
  return (
    <AuthProvider>
      <ToastContainer position="bottom-left" autoClose={1500} theme="colored" />
      <Navbar />
      <Outlet />
    </AuthProvider>
  );
};

export default RootLayout;


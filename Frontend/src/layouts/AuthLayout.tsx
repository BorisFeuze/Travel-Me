import { useAuth } from "@/context";
import { Outlet, Navigate } from "react-router";

const AuthLayout = () => {
  const { signedIn } = useAuth();

  if (!signedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthLayout;

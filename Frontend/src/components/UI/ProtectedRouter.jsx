import { Navigate, Outlet } from "react-router";

function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (
    !token &&
    location.pathname !== "/login" &&
    location.pathname !== "/register"
  ) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

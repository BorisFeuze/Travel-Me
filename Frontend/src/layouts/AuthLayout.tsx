import { useAuthor } from "@/context";
import { Outlet, Navigate } from "react-router";

const AuthLayout = () => {
  const { signedIn } = useAuthor();
  // console.log(signedIn);
  if (signedIn) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default AuthLayout;

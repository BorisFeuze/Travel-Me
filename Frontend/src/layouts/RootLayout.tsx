import { Outlet } from "react-router";
import { Navbar } from "@/components/UI";
import { AuthProvider, ChatProvider, UserProvider } from "@/context";

const RootLayout = () => {
  return (
    <AuthProvider>
      <ChatProvider>
        <UserProvider>
          <Navbar />
          <div className="pt-12">
            <Outlet />
          </div>
        </UserProvider>
      </ChatProvider>
    </AuthProvider>
  );
};

export default RootLayout;

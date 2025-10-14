import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/UI/Navbar.tsx";
import "react-toastify/dist/ReactToastify.css";
import {
  PokemonProvider,
  AuthProvider,
  BattleProvider,
} from "@/context/index.ts";

const RootLayout = () => {
  return (
    <AuthProvider>
      <ToastContainer position="bottom-left" autoClose={1500} theme="colored" />
      <Navbar />
      <BattleProvider>
        <PokemonProvider>
          <Outlet />
        </PokemonProvider>
      </BattleProvider>
    </AuthProvider>
  );
};

export default RootLayout;

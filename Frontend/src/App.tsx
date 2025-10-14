import { BrowserRouter, Routes, Route } from "react-router";
import RootLayout from "@/layouts/RootLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Battle from "@/pages/Battle";
import LeaderBoard from "@/pages/LeaderBoard";
import NotFound from "@/pages/NotFound";
import AuthLayout from "@/layouts/AuthLayout";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route element={<AuthLayout />}>
          <Route index element={<Home />} />
          <Route path="battle" element={<Battle />} />
          <Route path="leaderboard" element={<LeaderBoard />} />
        </Route>

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;

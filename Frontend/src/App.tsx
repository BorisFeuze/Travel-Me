import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Home,
  Login,
  NotFound,
  Chat,
  Registration,
  CreateJob,
  DetailCountry,
  DetailJob,
  UserAccount,
} from "./pages";
import RootLayout from "./layouts/RootLayout";
import AuthLayout from "./layouts/AuthLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Registration />} />
          <Route path="job/:id" element={<DetailJob />} />
          <Route path="country/:name" element={<DetailCountry />} />
          <Route path="*" element={<NotFound />} />

          {/* Protected Routes */}
          <Route element={<AuthLayout />}>
            <Route path="chat" element={<Chat />} />
            <Route path="account" element={<UserAccount />} />
            <Route path="create-job" element={<CreateJob />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

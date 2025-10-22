import { BrowserRouter, Routes, Route } from "react-router";
import {
  Home,
  Login,
  NotFound,
  Chat,
  Registration,
  CreateJob,
  DetailCountry,
  CountryLists,
  DetailJob,
  VolunteerAccount,
  HostAccount,
  Opportunities,
  DisplayHost,
} from "./pages";
import RootLayout from "./layouts/RootLayout";
import AuthLayout from "./layouts/AuthLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Registration />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="host/:id" element={<DisplayHost />} />
          <Route path="job/:id" element={<DetailJob />} />
          <Route path="country/:name" element={<DetailCountry />} />
          <Route path="countrylist" element={<CountryLists />} />
          <Route path="countrydetails" element={<DetailCountry />} />

          <Route element={<AuthLayout />}>
            <Route path="chat" element={<Chat />} />
            <Route path="volunteerAccount" element={<VolunteerAccount />} />
            <Route path="hostAccount" element={<HostAccount />} />
            <Route path="create-job" element={<CreateJob />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router";
import {
  Home,
  Login,
  NotFound,
  Chat,
  Registration,
  CreateJob,
  CountryLists,
  DetailJob,
  VolunteerAccount,
  HostAccount,
  Opportunities,
  DisplayHost,
  DetailContinent,
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
          <Route path="countrylist" element={<CountryLists />} />
          <Route path="chat" element={<Chat />} />
          <Route path="continent/:continent" element={<DetailContinent />} />

          <Route element={<AuthLayout />}>
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

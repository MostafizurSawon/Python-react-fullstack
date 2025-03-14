import { BrowserRouter, Routes, Route } from "react-router";

import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PasswordReset from "./pages/PasswordReset";
import PasswordResetOTP from "./pages/PasswordResetOTP";
import SetPasswordPage from "./pages/SetPasswordPage";

import DashboardLayout from "./layouts/DashboardLayout";
import DashboardIndexPage from "./pages/dashboard/IndexPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import CustomerPage from "./pages/dashboard/CustomerPage";
import LogoutPage from "./pages/LogoutPage";
import Test from "./components/Test";
import SalePage from "./pages/dashboard/SalePage";
import Demo from "./pages/Demo";
import Demo2 from "./pages/Demo2";


function App() {
  return (
    <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/a" element={<Demo />} />
        <Route path="/b" element={<Demo2 />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/reset-password-otp" element={<PasswordResetOTP />} />
        <Route path="/set-new-password" element={<SetPasswordPage />} />
        <Route path="/logout" element={<LogoutPage />} />

        <Route path="/dashboard/" element={<DashboardLayout />}>

          <Route path="index/" element={<DashboardIndexPage />} />
          <Route path="profile/" element={<ProfilePage />} />
          <Route path="customer/" element={<CustomerPage />} />

          <Route path="sale/" element={<SalePage />} />
          <Route path="test/" element={<Test />} />

        </Route>

        <Route path="*" element={<h1>404 Not Found!</h1>} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;

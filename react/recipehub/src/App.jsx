import { BrowserRouter, Routes, Route } from "react-router";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
import CategoryPage from "./pages/dashboard/CategoryPage";
import ProductPage from "./pages/dashboard/ProductPage";
import LogoutPage from "./pages/LogoutPage";
import Test from "./components/Test";
import SalePage from "./pages/dashboard/SalePage";
import NotFound from "./components/NotFound";
import RecipeForm from "./pages/dashboard/RecipeForm";
import RecipeDetail from "./pages/RecipeDetail"; // Adjusted path to root pages
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/reset-password-otp" element={<PasswordResetOTP />} />
        <Route path="/set-new-password" element={<SetPasswordPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} /> {/* Detail route at root level */}

        <Route path="/dashboard/" element={<DashboardLayout />}>
          <Route path="index/" element={<DashboardIndexPage />} />
          <Route path="profile/" element={<ProfilePage />} />
          <Route path="add-recipe/" element={<RecipeForm />} />
          <Route path="customer/" element={<CustomerPage />} />
          <Route path="category/" element={<CategoryPage />} />
          <Route path="product/" element={<ProductPage />} />
          <Route path="sale/" element={<SalePage />} />
          <Route path="test/" element={<Test />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
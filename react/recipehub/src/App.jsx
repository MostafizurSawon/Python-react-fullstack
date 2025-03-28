import { BrowserRouter, Routes, Route } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
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
import RecipeDetail from "./pages/RecipeDetail";
import "bootstrap/dist/css/bootstrap.min.css";
import AllUsers from "./partials/AllUsers";
import UserProfile from "./partials/UserProfile";
import UserInfo from "./partials/UserInfo";
import UserMessages from "./partials/UserMessages";
import NotVerifiedPage from "./pages/NotVerifiedPage"; // Added import

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/reset-password-otp" element={<PasswordResetOTP />} />
          <Route path="/set-new-password" element={<SetPasswordPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/not-verified" element={<NotVerifiedPage />} /> {/* Added route */}

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/" element={<DashboardLayout />}>
              <Route path="index/" element={<DashboardIndexPage />} />
              <Route path="update-profile/" element={<ProfilePage />} />
              <Route path="users/" element={<AllUsers />} />
              <Route path="messages/" element={<UserMessages />} />
              <Route path="users/:email" element={<UserProfile />} />
              <Route path="user-info/" element={<UserInfo />} />
              <Route path="add-recipe/" element={<RecipeForm />} />
              <Route path="customer/" element={<CustomerPage />} />
              <Route path="category/" element={<CategoryPage />} />
              <Route path="product/" element={<ProductPage />} />
              <Route path="sale/" element={<SalePage />} />
              <Route path="test/" element={<Test />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
import { useNavigate } from "react-router";
import myaxios from "../utils/myaxios";
import { errorToast, successToast } from "../utils/toast"; // Import toast functions
import Navbar from "./Navbar"; // Add Navbar for consistency
import Footer from "./Footer"; // Add Footer for consistency
import "./secure.css"; // Add secure.css for consistent styling

const SetPasswordPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formdata = new FormData(e.target);
    const data = Object.fromEntries(formdata);

    // Basic client-side validation (similar to RegisterPage)
    if (!data.password) {
      errorToast("Password is required");
      return;
    }
    if (data.password.length < 8) {
      errorToast("Password must be at least 8 characters");
      return;
    }

    myaxios
      .post("accounts/reset-password/", data)
      .then((response) => {
        if (response.data.status === "success") {
          // Show success toast
          successToast(response.data.message || "Password Reset Successfully!", {
            autoClose: 3000,
          }); // Set toast duration to 3 seconds
          // Delay navigation to allow the toast to be visible
          setTimeout(() => {
            navigate("/dashboard/index/");
          }, 3000); // Delay navigation by 3 seconds to match toast duration
        } else {
          // Show error toast with the backend message
          errorToast(response.data.message || "Failed to reset password!");
        }
      })
      .catch((error) => {
        if (error.response) {
          const errorData = error.response.data;
          if (errorData.message) {
            errorToast(errorData.message || "Failed to reset password!");
          } else {
            errorToast("Failed to reset password!");
          }
        } else {
          errorToast("An error occurred. Please try again.");
        }
        console.error(error);
      });
  };

  return (
    <div>
      <Navbar /> {/* Added Navbar for consistency */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6 center-screen">
            <div className="card animated fadeIn w-90 p-4">
              <div className="card-body">
                <h4>NEW PASSWORD</h4>
                <br />
                <form onSubmit={handleSubmit}>
                  <label>Your new password</label>
                  <input
                    id="password"
                    placeholder="New Password"
                    className="form-control"
                    type="password"
                    name="password"
                  />
                  <br />
                  <button
                    type="submit"
                    className="btn w-100 float-end bg-gradient-primary"
                  >
                    Next
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer /> {/* Added Footer for consistency */}
    </div>
  );
};

export default SetPasswordPage;
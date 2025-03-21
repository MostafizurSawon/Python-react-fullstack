import { useState } from "react";
import { useNavigate } from "react-router";
import myaxios from "../utils/myaxios";
import { errorToast, successToast } from "../utils/toast";
import Navbar from "./Navbar";
import Footer from "./Footer";

const RegisterPage = () => {
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    mobile: "",
  });

  // State for loading and errors
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic client-side validation
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      errorToast("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);
    setErrors({});

    myaxios
      .post("accounts/register/", formData)
      .then((response) => {
        if (response.data.status === "success") {
          successToast("Registered Successfully!");
          navigate("/login");
        } else {
          errorToast("Registration Failed!");
        }
      })
      .catch((error) => {
        if (error.response) {
          const errorData = error.response.data;
          if (errorData.message === "User Registration failed!") {
            // Handle specific field errors from the backend
            const backendErrors = errorData.message || {};
            setErrors(backendErrors);
            if (backendErrors.email) {
              errorToast(backendErrors.email || "Email already exists!");
            } else {
              errorToast("Registration Failed!");
            }
          } else {
            errorToast("Registration Failed!");
          }
        } else {
          errorToast("An error occurred. Please try again.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-10 center-screen">
            <div className="card animated fadeIn w-100 p-3">
              <div className="card-body">
                <h4>Sign Up</h4>
                <hr />
                <div className="container-fluid m-0 p-0">
                  <form onSubmit={handleSubmit}>
                    <div className="row m-0 p-0">
                      <div className="">
                        <label>Email Address</label>
                        <input
                          id="email"
                          placeholder="User Email"
                          className={`form-control ${errors.email ? "is-invalid" : ""}`}
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={loading}
                        />
                        {errors.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </div>
                      <div className="">
                        <label>First Name</label>
                        <input
                          id="firstName"
                          placeholder="First Name"
                          className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          disabled={loading}
                        />
                        {errors.firstName && (
                          <div className="invalid-feedback">{errors.firstName}</div>
                        )}
                      </div>
                      <div className="">
                        <label>Last Name</label>
                        <input
                          id="lastName"
                          placeholder="Last Name"
                          className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          disabled={loading}
                        />
                        {errors.lastName && (
                          <div className="invalid-feedback">{errors.lastName}</div>
                        )}
                      </div>
                      <div className="">
                        <label>Password</label>
                        <input
                          id="password"
                          placeholder="User Password"
                          className={`form-control ${errors.password ? "is-invalid" : ""}`}
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          disabled={loading}
                        />
                        {errors.password && (
                          <div className="invalid-feedback">{errors.password}</div>
                        )}
                      </div>
                      <div className="">
                        <label>Mobile Number</label>
                        <input
                          id="mobile"
                          placeholder="Mobile"
                          className="form-control"
                          type="tel"  // Corrected type from "mobile" to "tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="row m-0 p-0">
                      <div className="">
                        <button
                          type="submit"
                          className="btn mt-3 w-100 bg-gradient-primary"
                          disabled={loading}
                        >
                          {loading ? "Registering..." : "Register"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
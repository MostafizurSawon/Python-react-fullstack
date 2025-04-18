import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import myaxios from "../utils/myaxios";
import { errorToast, successToast } from "../utils/toast";
import "./secure.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();
  const [errorFields, setErrorFields] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
  const [isLoading, setIsLoading] = useState(false);

  // Check for verified query parameter on mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const verifiedStatus = queryParams.get("verified");

    if (verifiedStatus) {
      if (verifiedStatus === "true") {
        successToast("Email verified successfully! You can log in NOW!");
      } else if (verifiedStatus === "already") {
        errorToast("Email already verified.");
      } else if (verifiedStatus === "failed") {
        errorToast("Invalid or expired activation link.");
      }
    }
  }, [location.search]);

  // Detect device type on mount and on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const formdata = new FormData(e.target);
    const data = Object.fromEntries(formdata);

    setIsLoading(true);
    setErrorFields([]); // Reset error fields before submission

    try {
      const response = await myaxios.post("/accounts/login/", {
        email: data.email,
        password: data.password,
      });
      console.log("Login response:", response.data); // Debug log

      if (response.data.status === "success") {
        const token = response.data.token;
        const success = await login(data.email, data.password, token);
        if (success) {
          successToast("Login Successful!");
          setTimeout(() => {
            navigate("/dashboard/index/");
          }, 500);
        } else {
          throw new Error("Context login failed");
        }
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error);
      const errorData = error.response?.data || {};
      if (errorData.status === "unauthorized") {
        setErrorFields(["email", "password"]);
        errorToast("Invalid Credentials");
      } else if (errorData.status === "unverified") {
        errorToast(errorData.message || "Please verify your email before logging in.");
        navigate("/not-verified", { state: { email: data.email } });
      } else {
        setErrorFields(["email", "password"]);
        errorToast(errorData.message || "Failed to log in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="container-fluid d-flex justify-content-center align-items-center"
        style={{
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          minHeight: "calc(100vh - 120px)",
          paddingTop: "80px",
          paddingBottom: "40px",
        }}
      >
        <div
          className="card p-4 shadow-lg"
          style={{
            maxWidth: "400px",
            width: "90%",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#fff",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="card-body">
            <h4
              className="text-center mb-4"
              style={{
                color: "#8B0000",
                fontWeight: "600",
                letterSpacing: "1px",
              }}
            >
              SIGN IN
            </h4>
            <form onSubmit={handleSubmit}>
              <div
                className={`form-group mb-3 ${
                  errorFields.includes("email") ? "error" : ""
                }`}
              >
                <input
                  id="email"
                  placeholder="User Email"
                  className="form-control"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    borderRadius: "10px",
                    padding: "12px",
                    borderColor: errorFields.includes("email")
                      ? "#dc3545"
                      : "#ced4da",
                    transition: "border-color 0.3s ease",
                    fontSize: "16px",
                  }}
                />
              </div>
              <div
                className={`form-group mb-4 ${
                  errorFields.includes("password") ? "error" : ""
                }`}
              >
                <input
                  id="password"
                  placeholder="User Password"
                  className="form-control"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    borderRadius: "10px",
                    padding: "12px",
                    borderColor: errorFields.includes("password")
                      ? "#dc3545"
                      : "#ced4da",
                    transition: "border-color 0.3s ease",
                    fontSize: "16px",
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn"
                disabled={isLoading}
                style={{
                  background:
                    "linear-gradient(90deg, #8B0000 0%, #FFC107 100%)",
                  color: "#fff",
                  padding: "12px 24px",
                  borderRadius: "10px",
                  fontWeight: "500",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  display: "block",
                  margin: "0 auto",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = "scale(1.02)";
                    e.target.style.boxShadow =
                      "0 4px 15px rgba(139, 0, 0, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "none";
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
              <hr className="my-4" style={{ borderColor: "#ced4da" }} />
              <div className="text-center">
                <span>
                  <Link
                    className="h6 text-decoration-none"
                    to="/register/"
                    style={{
                      color: "#8B0000",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#FFC107")}
                    onMouseLeave={(e) => (e.target.style.color = "#8B0000")}
                  >
                    Sign Up
                  </Link>
                  <span className="mx-2">|</span>
                  <Link
                    className="h6 text-decoration-none"
                    to="/reset-password/"
                    style={{
                      color: "#8B0000",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#FFC107")}
                    onMouseLeave={(e) => (e.target.style.color = "#8B0000")}
                  >
                    Forgot Password?
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
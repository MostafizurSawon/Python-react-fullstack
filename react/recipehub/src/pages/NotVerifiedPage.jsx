import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import myaxios from "../utils/myaxios";
import { errorToast, successToast } from "../utils/toast";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./secure.css";

const NotVerifiedPage = () => {
  const location = useLocation();
  const email = location.state?.email || "your email";
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0); // Cooldown in seconds
  const COOLDOWN_SECONDS = 300; // 5 minutes

  // Countdown timer for cooldown
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const response = await myaxios.post("/users/resend-verification/", { email });
      if (response.data.status === "success") {
        successToast(response.data.message || "Verification link resent successfully!");
        setCooldown(COOLDOWN_SECONDS); // Start 5-minute cooldown
      } else {
        throw new Error(response.data.message || "Failed to resend verification link.");
      }
    } catch (error) {
      console.error("Resend verification error ->", error);
      const errorMessage = error.response?.data?.message || "Failed to resend verification link.";
      if (error.response?.data?.status === "cooldown") {
        const remaining = error.response.data.remaining || COOLDOWN_SECONDS;
        setCooldown(remaining); // Set remaining time from backend
      }
      errorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCooldown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
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
          className="card p-4 shadow-lg text-center"
          style={{
            maxWidth: "500px",
            width: "90%",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#fff",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="card-body">
            <h4
              className="mb-4"
              style={{
                color: "#8B0000",
                fontWeight: "600",
                letterSpacing: "1px",
              }}
            >
              Email Not Verified
            </h4>
            <p className="mb-4" style={{ fontSize: "16px", color: "#333" }}>
              You need to verify your email before you can log in. Please check{" "}
              <strong>{email}</strong> for a verification link. If you didn’t
              receive it, check your spam folder or resend it below.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link
                to="/register"
                className="btn"
                style={{
                  background: "#8B0000",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  transition: "background 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#FFC107")}
                onMouseLeave={(e) => (e.target.style.background = "#8B0000")}
              >
                Register Again
              </Link>
              <button
                onClick={handleResendVerification}
                className="btn"
                disabled={isLoading || cooldown > 0}
                style={{
                  background: "#28a745",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  transition: "background 0.3s ease",
                  opacity: cooldown > 0 ? 0.6 : 1,
                }}
                onMouseEnter={(e) =>
                  !isLoading && cooldown === 0 && (e.target.style.background = "#218838")
                }
                onMouseLeave={(e) =>
                  !isLoading && cooldown === 0 && (e.target.style.background = "#28a745")
                }
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Sending...
                  </>
                ) : cooldown > 0 ? (
                  `Resend in ${formatCooldown(cooldown)}`
                ) : (
                  "Resend Verification Link"
                )}
              </button>
              <Link
                to="/login"
                className="btn"
                style={{
                  background: "#FFC107",
                  color: "#8B0000",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  transition: "background 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#8B0000")}
                onMouseLeave={(e) => (e.target.style.background = "#FFC107")}
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotVerifiedPage;
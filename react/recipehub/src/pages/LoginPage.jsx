import { Link, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { useState, useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";
import myaxios from "../utils/myaxios";
import { errorToast, successToast } from "../utils/toast";
import "./secure.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Added to access query parameters
  const { login } = useUser();
  const [errorFields, setErrorFields] = useState([]);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef(null);
  const lastMoveTimeRef = useRef(0);
  const funnyAudioRef = useRef(null);
  const successAudioRef = useRef(null);

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

  // Initialize audio elements
  useEffect(() => {
    funnyAudioRef.current = new Audio(
      "https://www.myinstants.com/media/sounds/boing.mp3"
    );
    successAudioRef.current = new Audio(
      "https://www.myinstants.com/media/sounds/success.mp3"
    );
    funnyAudioRef.current.loop = true;

    return () => {
      funnyAudioRef.current.pause();
      successAudioRef.current.pause();
    };
  }, []);

  // Validate password with increased debounce time and better error handling
  useEffect(() => {
    if (!email || !password) {
      setIsPasswordCorrect(false);
      return;
    }

    const debounceTimeout = setTimeout(() => {
      myaxios
        .post("/accounts/validate-password/", { email, password })
        .then((response) => {
          if (response.data.status === "valid") {
            setIsPasswordCorrect(true);
            funnyAudioRef.current.pause();
            successAudioRef.current.play();
            setTimeout(() => {
              successAudioRef.current.pause();
              successAudioRef.current.currentTime = 0;
            }, 3000);
          } else {
            setIsPasswordCorrect(false);
            if (isDesktop) {
              funnyAudioRef.current.play();
            }
          }
        })
        .catch((error) => {
          console.error("Password validation error ->", error);
          setIsPasswordCorrect(false);
          if (isDesktop) {
            funnyAudioRef.current.play();
          }
        });
    }, 1000);

    return () => clearTimeout(debounceTimeout);
  }, [email, password, isDesktop]);

  // Handle button movement on mouse move (only for desktop)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDesktop || isPasswordCorrect) {
        setButtonPosition({ x: 0, y: 0 });
        return;
      }

      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const deltaX = mouseX - buttonCenterX;
      const deltaY = mouseY - buttonCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      const currentTime = Date.now();
      const timeSinceLastMove = currentTime - lastMoveTimeRef.current;
      const moveDelay = 300;

      if (distance < 50 && timeSinceLastMove > moveDelay) {
        const moveRange = 300;
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * moveRange;
        const newX = Math.cos(angle) * radius;
        const newY = Math.sin(angle) * radius;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const minX = -rect.left + 10;
        const maxX = viewportWidth - rect.left - rect.width - 10;
        const minY = -rect.top + 10;
        const maxY = viewportHeight - rect.top - rect.height - 10;

        const boundedX = Math.max(minX, Math.min(maxX, newX));
        const boundedY = Math.max(minY, Math.min(maxY, newY));

        setButtonPosition({ x: boundedX, y: boundedY });
        lastMoveTimeRef.current = currentTime;
      }
    };

    if (isDesktop) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (isDesktop) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [isPasswordCorrect, buttonPosition, isDesktop]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formdata = new FormData(e.target);
    const data = Object.fromEntries(formdata);

    setIsLoading(true);
    try {
      const response = await myaxios.post("/accounts/login/", {
        email: data.email,
        password: data.password,
      });

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
      } else if (response.data.status === "unverified") {
        errorToast(response.data.message);
        navigate("/not-verified", { state: { email: data.email } });
      } else {
        throw new Error(response.data.message || "Invalid Credentials");
      }
    } catch (error) {
      console.error("Login error ->", error);
      setErrorFields(["email", "password"]);
      setIsPasswordCorrect(false);
      if (error.response?.data?.status === "unverified") {
        errorToast(error.response.data.message);
        navigate("/not-verified", { state: { email: data.email } });
      } else {
        errorToast("Failed to log in. Please check your email and password.");
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
          className="card p-4 shadow-lg position-relative"
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
                ref={buttonRef}
                type="submit"
                className={`btn ${isDesktop && !isPasswordCorrect ? "wobble" : ""}`}
                disabled={isLoading}
                style={{
                  background:
                    "linear-gradient(90deg, #8B0000 0%, #FFC107 100%)",
                  color: "#fff",
                  padding: "12px 24px",
                  borderRadius: "10px",
                  fontWeight: "500",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  position: isDesktop && !isPasswordCorrect ? "absolute" : "relative",
                  transform:
                    isDesktop && !isPasswordCorrect
                      ? `translate(${buttonPosition.x}px, ${buttonPosition.y}px)`
                      : "none",
                  zIndex: 1000,
                  display: "block",
                  margin: "0 auto",
                }}
                onMouseEnter={(e) => {
                  if (isPasswordCorrect && !isLoading) {
                    e.target.style.transform = "scale(1.02)";
                    e.target.style.boxShadow =
                      "0 4px 15px rgba(139, 0, 0, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (isPasswordCorrect && !isLoading) {
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
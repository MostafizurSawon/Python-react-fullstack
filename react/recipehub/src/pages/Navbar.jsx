import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle authentication state
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Handle scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle outside click to close menu
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen]);

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setIsMenuOpen(false);
  };

  // Handle scroll to MainSection with animation
  const handleScrollToMainSection = () => {
    setIsMenuOpen(false); // Close the mobile menu if open

    // Check if we're already on the homepage
    if (location.pathname === "/") {
      // Find the MainSection element by its ID
      const mainSection = document.getElementById("main-section");
      if (mainSection) {
        mainSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        // Add a class to trigger the animation
        mainSection.classList.add("animate-on-scroll");
      }
    } else {
      // Navigate to the homepage and scroll after navigation
      navigate("/");
      // Use a slight delay to ensure the page has loaded
      setTimeout(() => {
        const mainSection = document.getElementById("main-section");
        if (mainSection) {
          mainSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          mainSection.classList.add("animate-on-scroll");
        }
      }, 100);
    }
  };

  return (
    <div className="mb-5 pb-4">
      <nav
        ref={navbarRef}
        className={`fixed-top ${isScrolled ? "shadow-lg" : "shadow-sm"}`}
        style={{
          background: "linear-gradient(90deg, #8B0000 0%, #FFC107 100%)",
          color: "#fff",
          padding: "10px 0",
        }}
      >
        <div className="container d-flex align-items-center justify-content-between">
          {/* Brand with Logo */}
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <img
              className="rounded"
              src="/logo.png"
              alt="RecipeHub"
              style={{ height: "40px", width: "auto" }}
              onError={(e) => (e.target.src = "https://placehold.co/100x40?text=RecipeHub")}
            />
          </Link>

          {/* Toggle Button */}
          <button
            className="d-lg-none border-0 bg-transparent"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
            style={{
              color: "#fff",
              fontSize: "1.5rem",
              transition: "transform 0.3s ease",
              transform: isMenuOpen ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            <i className={`bi ${isMenuOpen ? "bi-x-lg" : "bi-list"}`}></i>
          </button>

          {/* Menu Items */}
          <div
            className={`d-flex align-items-center ${
              isMenuOpen ? "d-flex" : "d-none d-lg-flex"
            } flex-column flex-lg-row gap-3 mt-3 mt-lg-0`}
            style={{
              position: isMenuOpen ? "absolute" : "relative",
              top: isMenuOpen ? "60px" : "auto",
              left: 0,
              right: 0,
              background: isMenuOpen
                ? "linear-gradient(90deg, #8B0000 0%, #FFC107 100%)"
                : "transparent",
              padding: isMenuOpen ? "20px" : "0",
              zIndex: 1000,
              transition: "all 0.3s ease",
            }}
          >
            <ul className="d-flex flex-column flex-lg-row list-unstyled gap-3 mb-0">
              <li>
                <Link
                  to="/"
                  className="text-white text-decoration-none px-3 py-2 rounded"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    transition: "background 0.3s ease",
                    fontWeight: "500",
                    lineHeight: "1.5",
                    display: "inline-block", // Ensure consistent rendering
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "rgba(255, 255, 255, 0.15)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "transparent")
                  }
                >
                  Home
                </Link>
              </li>
              <li>
                <button
                  onClick={handleScrollToMainSection}
                  className="text-white text-decoration-none px-3 py-2 rounded border-0 bg-transparent"
                  style={{
                    transition: "background 0.3s ease",
                    fontWeight: "500",
                    lineHeight: "1.5",
                    display: "inline-block", // Match Link styling
                    fontSize: "inherit", // Ensure font size matches
                    cursor: "pointer", // Ensure pointer cursor
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "rgba(255, 255, 255, 0.15)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "transparent")
                  }
                >
                  Recipe
                </button>
              </li>
              <li>
                <Link
                  to="/dashboard/index"
                  className="text-white text-decoration-none px-3 py-2 rounded"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    transition: "background 0.3s ease",
                    fontWeight: "500",
                    lineHeight: "1.5",
                    display: "inline-block",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "rgba(255, 255, 255, 0.15)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "transparent")
                  }
                >
                  Dashboard
                </Link>
              </li>
            </ul>

            {/* Auth Buttons / Profile and Logout */}
            <div className="d-flex flex-column flex-lg-row gap-2 mt-3 mt-lg-0 align-items-center">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard/user-info/"
                    className="text-white text-decoration-none px-3 py-2 rounded d-flex align-items-center"
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      transition: "background 0.3s ease",
                      fontWeight: "500",
                      lineHeight: "1.5",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "rgba(255, 255, 255, 0.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background = "rgba(255, 255, 255, 0.1)")
                    }
                  >
                    <i className="bi bi-person me-2"></i>
                    Profile
                  </Link>
                  <Link
                    to="/logout"
                    onClick={handleLogout}
                    className="text-white text-decoration-none px-3 py-2 rounded d-flex align-items-center"
                    style={{
                      background: "rgba(255, 255, 255, 0.2)",
                      transition: "background 0.3s ease",
                      fontWeight: "500",
                      lineHeight: "1.5",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "rgba(255, 255, 255, 0.3)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background = "rgba(255, 255, 255, 0.2)")
                    }
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white text-decoration-none px-4 py-2 rounded"
                    style={{
                      background: "linear-gradient(90deg, #3498db 0%, #2980b9 100%)",
                      transition: "transform 0.2s ease, box-shadow 0.3s ease",
                      lineHeight: "1.5",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.05)";
                      e.target.style.boxShadow = "0 4px 15px rgba(52, 152, 219, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white text-decoration-none px-4 py-2 rounded"
                    style={{
                      background: "linear-gradient(90deg, #2ecc71 0%, #27ae60 100%)",
                      transition: "transform 0.2s ease, box-shadow 0.3s ease",
                      lineHeight: "1.5",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.05)";
                      e.target.style.boxShadow = "0 4px 15px rgba(46, 204, 113, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
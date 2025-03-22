import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import Navbar from "../partials/NavBar";
import Footer from "../pages/Footer";

function UserInfo() {
  const { user } = useUser(); 


  const defaultImage = "https://www.pngkey.com/png/full/72-729716_user-avatar-png-graphic-free-download-icon.png";


  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

  // Construct the full image URL
  const profileImage = user?.profile?.image
    ? `${BASE_URL}${user.profile.image}` // e.g., http://127.0.0.1:8000/media/users/images/gojo.jpg
    : defaultImage;

  // If user is not logged in, show a message
  if (!user) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="container my-5 flex-grow-1 text-center">
          <h2 className="mb-4 display-5 text-primary">Profile</h2>
          <p className="text-muted lead fs-4 mb-5">
            Please log in to view your profile.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* <Navbar /> */}
      <section
        className="flex-grow-1 py-5"
        style={{
          background: "linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div
                className="card border-0 shadow-lg rounded-4"
                style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <div className="card-body p-4 p-md-5">
                  {/* Profile Image */}
                  <div className="text-center mb-4">
                    <img
                      src={profileImage}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="rounded-circle shadow"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        border: "3px solid #007bff",
                      }}
                    />
                  </div>
                  {/* User Name */}
                  <h3 className="text-center text-primary mb-3">
                    {user.firstName} {user.lastName}
                  </h3>
                  {/* Role */}
                  <div className="text-center mb-4">
                    <span
                      className="badge bg-primary text-white px-3 py-2 rounded-pill"
                      style={{ fontSize: "1rem" }}
                    >
                      Role: {user.role || "User"}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-envelope-fill text-primary me-2"></i>
                      <p className="mb-0">
                        <strong className="text-muted">Email:</strong> {user.email}
                      </p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-telephone-fill text-primary me-2"></i>
                      <p className="mb-0">
                        <strong className="text-muted">Phone:</strong>{" "}
                        {user.mobile || "Not specified"}
                      </p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-person-fill text-primary me-2"></i>
                      <p className="mb-0">
                        <strong className="text-muted">Age:</strong>{" "}
                        {user.profile?.age || "Not specified"}
                      </p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-gender-ambiguous text-primary me-2"></i>
                      <p className="mb-0">
                        <strong className="text-muted">Sex:</strong>{" "}
                        {user.profile?.sex || "Not specified"}
                      </p>
                    </div>
                  </div>
                  {/* Bio Section */}
                  {user.profile?.bio && (
                    <div className="mb-4">
                      <h5 className="mb-2 text-decoration-none text-muted">
                        <i className="bi bi-info-circle-fill text-primary me-2"></i>About Me
                      </h5>
                      <p className="text-muted">{user.profile.bio}</p>
                    </div>
                  )}
                  {/* Social Link */}
                  
                  <div className="d-flex justify-content-between align-items-center">
                  {user.profile?.facebook && (
                    <div className="mb-4">
                      <a
                        href={user.profile.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary me-2 text-decoration-none"
                        style={{
                          transition: "color 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#0056b3")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#007bff")}
                      >
                        <i className="bi bi-facebook fs-4"><span className="px-2 ">Facebook</span></i>
                      </a>
                    </div>
                  )}
                  {user.profile?.portfolio && (
                    <div className="mb-4">
                      
                        
                      
                      <a
                        href={user.profile.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary me-2 text-decoration-none"
                        style={{
                          transition: "color 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#0056b3")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#007bff")}
                      >
                        <i className="bi bi-browser-chrome fs-4"><span className="px-2">Portfolio</span></i>
                      </a>
                    </div>
                  )}
                  </div>

                  {/* Edit Profile Button */}
                  <div className="text-center">
                    <Link
                      to="/dashboard/update-profile"
                      className="btn btn-primary px-4 py-2"
                      style={{
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#0056b3")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#007bff")
                      }
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <Footer /> */}
    </div>
  );
}

export default UserInfo;
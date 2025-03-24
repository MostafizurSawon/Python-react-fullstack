import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import myaxios from "../utils/myaxios";
import { errorToast, successToast } from "../utils/toast";
import Navbar from "./NavBar";
import Footer from "../pages/Footer";
import { useUser } from "../context/UserContext";
import "./UserProfile.css";

const UserProfile = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useUser();

  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Default demo photo URL
  const defaultPhoto = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          errorToast("Please log in to access this page");
          navigate("/login");
          return;
        }

        if (currentUser?.role !== "Admin") {
          errorToast("You do not have permission to view this page");
          navigate("/dashboard");
          return;
        }

        const userResponse = await myaxios.get(`accounts/profile/${email}/`);
        if (userResponse.data.status === "success") {
          setUser(userResponse.data.data);
          setNewRole(userResponse.data.data.role); // Set initial role for dropdown
        } else {
          errorToast("Failed to fetch user profile");
          navigate("/dashboard/users");
          return;
        }

        setLoadingRecipes(true);
        try {
          const recipesResponse = await myaxios.get(`recipes/by-user/${email}/`);
          if (recipesResponse.data.results.status === "success") {
            setRecipes(recipesResponse.data.results.data);
          } else {
            errorToast("Failed to fetch user recipes: " + (recipesResponse.data.results.message || "Unknown error"));
            setRecipes([]);
          }
        } catch (recipeError) {
          console.error("Error fetching recipes:", recipeError);
          if (recipeError.response) {
            const errorMessage = recipeError.response.data.message || "Internal Server Error";
            errorToast(`Failed to fetch user recipes: ${errorMessage}`);
          } else {
            errorToast("Failed to fetch user recipes: Network error");
          }
          setRecipes([]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response) {
          errorToast(`Error: ${error.response.data.message || "Failed to fetch user data"}`);
        } else {
          errorToast("An error occurred while fetching user data");
        }
        navigate("/dashboard/users");
      } finally {
        setLoading(false);
        setLoadingRecipes(false);
      }
    };

    fetchUserProfile();
  }, [email, navigate, currentUser]);

  const handleRoleChange = async () => {
    if (!newRole || newRole === user.role) {
      errorToast("Please select a different role to update");
      return;
    }

    setIsUpdatingRole(true);
    try {
      const response = await myaxios.put(`accounts/profile/${email}/update-role/`, { role: newRole });
      if (response.data.status === "success") {
        setUser({ ...user, role: newRole });
        successToast(response.data.message);
      } else {
        errorToast(response.data.message || "Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      if (error.response) {
        errorToast(`Error: ${error.response.data.message || "Failed to update role"}`);
      } else {
        errorToast("An error occurred while updating the role");
      }
    } finally {
      setIsUpdatingRole(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center my-5">
        <p className="text-muted fs-4">User not found.</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <div className="container my-5 flex-grow-1">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            to="/dashboard/users"
            className="btn btn-outline-primary d-flex align-items-center gap-2 transition-all"
            style={{
              borderRadius: "8px",
              padding: "10px 20px",
              fontWeight: "500",
              transition: "all 0.3s ease",
            }}
          >
            <i className="bi bi-arrow-left"></i> Back to All Users
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-5">
          <h2
            className="display-4 fw-bold"
            style={{
              color: "#2c3e50",
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: "0.5px",
            }}
          >
            {user.firstName} {user.lastName}'s Profile
          </h2>
          <p
            className="lead text-muted"
            style={{ fontFamily: "'Roboto', sans-serif", fontSize: "1.1rem" }}
          >
            Explore the culinary journey of {user.firstName}
          </p>
        </div>

        {/* Profile Card */}
        <div
          className="card shadow-lg border-0 mb-5"
          style={{
            borderRadius: "20px",
            background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
            transition: "transform 0.3s ease",
          }}
        >
          <div className="card-body p-4 p-md-5">
            <div className="row align-items-center">
              <div className="col-md-4 text-center mb-4 mb-md-0">
                <div
                  className="position-relative"
                  style={{
                    width: "200px",
                    height: "200px",
                    margin: "0 auto",
                  }}
                >
                  <img
                    src={user.profile.image || defaultPhoto}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="img-fluid rounded-circle shadow-sm"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      border: "4px solid #ffffff",
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
              </div>
              <div className="col-md-8">
                <h3
                  className="fw-bold mb-4"
                  style={{
                    color: "#2c3e50",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "1.75rem",
                  }}
                >
                  {user.firstName} {user.lastName}
                </h3>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <strong
                      className="text-muted d-block"
                      style={{ fontSize: "0.95rem", fontWeight: "500" }}
                    >
                      Email:
                    </strong>
                    <span
                      className="ms-2"
                      style={{ color: "#34495e", fontSize: "1rem" }}
                    >
                      {user.email}
                    </span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong
                      className="text-muted d-block"
                      style={{ fontSize: "0.95rem", fontWeight: "500" }}
                    >
                      Role:
                    </strong>
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className={`badge ${
                          user.role === "Admin"
                            ? "bg-danger"
                            : user.role === "Chef"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                        style={{
                          fontSize: "0.9rem",
                          padding: "6px 12px",
                          borderRadius: "12px",
                        }}
                      >
                        {user.role}
                      </span>
                      {/* Role Change Dropdown and Button */}
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="form-select form-select-sm"
                        style={{ width: "120px", fontSize: "0.9rem" }}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Chef">Chef</option>
                        <option value="User">User</option>
                      </select>
                      <button
                        onClick={handleRoleChange}
                        className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                        disabled={isUpdatingRole || newRole === user.role}
                        style={{
                          borderRadius: "8px",
                          padding: "5px 10px",
                          fontSize: "0.9rem",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {isUpdatingRole ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-1"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-person-gear"></i>
                            Update Role
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong
                      className="text-muted d-block"
                      style={{ fontSize: "0.95rem", fontWeight: "500" }}
                    >
                      Mobile:
                    </strong>
                    <span
                      className="ms-2"
                      style={{ color: "#34495e", fontSize: "1rem" }}
                    >
                      {user.mobile || "N/A"}
                    </span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong
                      className="text-muted d-block"
                      style={{ fontSize: "0.95rem", fontWeight: "500" }}
                    >
                      Age:
                    </strong>
                    <span
                      className="ms-2"
                      style={{ color: "#34495e", fontSize: "1rem" }}
                    >
                      {user.profile.age || "N/A"}
                    </span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong
                      className="text-muted d-block"
                      style={{ fontSize: "0.95rem", fontWeight: "500" }}
                    >
                      Sex:
                    </strong>
                    <span
                      className="ms-2"
                      style={{ color: "#34495e", fontSize: "1rem" }}
                    >
                      {user.profile.sex || "N/A"}
                    </span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong
                      className="text-muted d-block"
                      style={{ fontSize: "0.95rem", fontWeight: "500" }}
                    >
                      Bio:
                    </strong>
                    <span
                      className="ms-2"
                      style={{ color: "#34495e", fontSize: "1rem" }}
                    >
                      {user.profile.bio || "N/A"}
                    </span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong
                      className="text-muted d-block"
                      style={{ fontSize: "0.95rem", fontWeight: "500" }}
                    >
                      Portfolio:
                    </strong>
                    {user.profile.portfolio ? (
                      <a
                        href={user.profile.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ms-2 text-primary text-decoration-none"
                        style={{
                          fontSize: "1rem",
                          transition: "color 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#1e90ff")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#007bff")}
                      >
                        View Portfolio
                      </a>
                    ) : (
                      <span
                        className="ms-2"
                        style={{ color: "#34495e", fontSize: "1rem" }}
                      >
                        N/A
                      </span>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong
                      className="text-muted d-block"
                      style={{ fontSize: "0.95rem", fontWeight: "500" }}
                    >
                      Facebook:
                    </strong>
                    {user.profile.facebook ? (
                      <a
                        href={user.profile.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ms-2 text-primary text-decoration-none"
                        style={{
                          fontSize: "1rem",
                          transition: "color 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#1e90ff")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#007bff")}
                      >
                        View Facebook
                      </a>
                    ) : (
                      <span
                        className="ms-2"
                        style={{ color: "#34495e", fontSize: "1rem" }}
                      >
                        N/A
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recipes Section */}
        <div className="text-center mb-5">
          <h3
            className="fw-bold"
            style={{
              color: "#2c3e50",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "2rem",
            }}
          >
            Recipes by {user.firstName}
          </h3>
          <p
            className="lead text-muted"
            style={{ fontFamily: "'Roboto', sans-serif", fontSize: "1.1rem" }}
          >
            Discover delicious recipes created by {user.firstName}
          </p>
        </div>

        {loadingRecipes ? (
          <div className="text-center my-5">
            <div
              className="spinner-border text-primary"
              role="status"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <span className="visually-hidden">Loading recipes...</span>
            </div>
            <p
              className="text-muted mt-3"
              style={{ fontFamily: "'Roboto', sans-serif", fontSize: "1rem" }}
            >
              Fetching recipes...
            </p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center my-5">
            <p
              className="text-muted fs-5"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              No recipes found.
            </p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="col">
                <div
                  className="card shadow-sm border-0 h-100"
                  style={{
                    borderRadius: "15px",
                    overflow: "hidden",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  {recipe.img ? (
                    <img
                      src={recipe.img}
                      alt={recipe.title}
                      className="card-img-top"
                      style={{
                        height: "200px",
                        objectFit: "cover",
                        borderTopLeftRadius: "15px",
                        borderTopRightRadius: "15px",
                      }}
                    />
                  ) : (
                    <div
                      className="bg-light d-flex align-items-center justify-content-center"
                      style={{
                        height: "200px",
                        borderTopLeftRadius: "15px",
                        borderTopRightRadius: "15px",
                      }}
                    >
                      <i
                        className="bi bi-image text-muted"
                        style={{ fontSize: "50px" }}
                      ></i>
                    </div>
                  )}
                  <div className="card-body d-flex flex-column p-4">
                    <h5
                      className="card-title fw-bold mb-3"
                      style={{
                        color: "#2c3e50",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "1.25rem",
                      }}
                    >
                      {recipe.title}
                    </h5>
                    <p
                      className="card-text text-muted mb-2"
                      style={{ fontSize: "0.95rem" }}
                    >
                      <strong>Category:</strong>
                      <span className="ms-1">
                        {recipe.category_names?.length > 0
                          ? recipe.category_names.join(", ")
                          : "Uncategorized"}
                      </span>
                    </p>
                    <p
                      className="card-text text-muted flex-grow-1"
                      style={{ fontSize: "0.95rem", lineHeight: "1.5" }}
                    >
                      {recipe.instructions?.substring(0, 100)}...
                    </p>
                    <Link
                      to={`/recipes/${recipe.id}`}
                      className="btn btn-primary btn-sm mt-auto"
                      style={{
                        borderRadius: "8px",
                        padding: "8px 16px",
                        fontWeight: "500",
                        backgroundColor: "#007bff",
                        borderColor: "#007bff",
                        transition: "background-color 0.3s ease, transform 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#0056b3";
                        e.currentTarget.style.borderColor = "#0056b3";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#007bff";
                        e.currentTarget.style.borderColor = "#007bff";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      View Recipe
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
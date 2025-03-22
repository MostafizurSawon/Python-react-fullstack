// src/partials/UserProfile.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import myaxios from "../utils/myaxios";
import { errorToast } from "../utils/toast";
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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          errorToast("Please log in to access this page");
          navigate("/login");
          return;
        }

        // Optional: Restrict to admins
        if (currentUser?.role !== "Admin") {
          errorToast("You do not have permission to view this page");
          navigate("/dashboard");
          return;
        }

        const userResponse = await myaxios.get(`accounts/profile/${email}/`);
        if (userResponse.data.status === "success") {
          setUser(userResponse.data.data);
        } else {
          errorToast("Failed to fetch user profile");
          navigate("/dashboard/users");
          return;
        }

        setLoadingRecipes(true);
        const recipesResponse = await myaxios.get(`recipes/by-user/${email}/`);
        if (recipesResponse.data.status === "success") {
          setRecipes(recipesResponse.data.data);
        } else {
          errorToast("Failed to fetch user recipes");
        }
      } catch (error) {
        errorToast("An error occurred while fetching user data");
        console.error(error);
        navigate("/dashboard/users");
      } finally {
        setLoading(false);
        setLoadingRecipes(false);
      }
    };

    fetchUserProfile();
  }, [email, navigate, currentUser]);

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
      <div className="container my-5 flex-grow-1">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-dark">
            {user.firstName} {user.lastName}'s Profile
          </h2>
          <p className="text-muted lead">
            Explore the culinary journey of {user.firstName}
          </p>
        </div>

        {/* Profile Card */}
        <div className="card shadow-lg border-0 rounded-4 mb-5">
          <div className="card-body p-5">
            <div className="row align-items-center">
              <div className="col-md-4 text-center mb-4 mb-md-0">
                {user.profile.image ? (
                  <img
                    src={user.profile.image}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="img-fluid rounded-circle shadow-sm transition-all"
                    style={{ width: "200px", height: "200px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-gradient bg-secondary d-flex align-items-center justify-content-center shadow-sm"
                    style={{ width: "200px", height: "200px" }}
                  >
                    <i
                      className="bi bi-person-fill text-white"
                      style={{ fontSize: "80px" }}
                    ></i>
                  </div>
                )}
              </div>
              <div className="col-md-8">
                <h3 className="fw-bold text-dark mb-4">
                  {user.firstName} {user.lastName}
                </h3>
                <div className="mb-3">
                  <strong className="text-muted d-block">Email:</strong>
                  <span className="ms-2">{user.email}</span>
                </div>
                <div className="mb-3">
                  <strong className="text-muted d-block">Role:</strong>
                  <span
                    className={`badge ms-2 ${
                      user.role === "Admin"
                        ? "bg-danger"
                        : user.role === "Chef"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <div className="mb-3">
                  <strong className="text-muted d-block">Mobile:</strong>
                  <span className="ms-2">{user.mobile || "N/A"}</span>
                </div>
                <div className="mb-3">
                  <strong className="text-muted d-block">Age:</strong>
                  <span className="ms-2">{user.profile.age || "N/A"}</span>
                </div>
                <div className="mb-3">
                  <strong className="text-muted d-block">Sex:</strong>
                  <span className="ms-2">{user.profile.sex || "N/A"}</span>
                </div>
                <div className="mb-3">
                  <strong className="text-muted d-block">Bio:</strong>
                  <span className="ms-2">{user.profile.bio || "N/A"}</span>
                </div>
                <div className="mb-3">
                  <strong className="text-muted d-block">Portfolio:</strong>
                  {user.profile.portfolio ? (
                    <a
                      href={user.profile.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ms-2 text-primary text-decoration-none transition-all"
                    >
                      View Portfolio
                    </a>
                  ) : (
                    <span className="ms-2">N/A</span>
                  )}
                </div>
                <div className="mb-3">
                  <strong className="text-muted d-block">Facebook:</strong>
                  {user.profile.facebook ? (
                    <a
                      href={user.profile.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ms-2 text-primary text-decoration-none transition-all"
                    >
                      View Facebook
                    </a>
                  ) : (
                    <span className="ms-2">N/A</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recipes Section */}
        <div className="text-center mb-5">
          <h3 className="fw-bold text-dark">
            Recipes by {user.firstName}
          </h3>
          <p className="text-muted lead">
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
            <p className="text-muted mt-3">Fetching recipes...</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center my-5">
            <p className="text-muted fs-5">No recipes found.</p>
          </div>
        ) : (
          <div className="row">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="col-md-4 mb-4">
                <div className="card shadow-sm border-0 rounded-3 h-100 transition-all">
                  {recipe.image && (
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="card-img-top rounded-top-3"
                      style={{ height: "220px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-dark mb-3">
                      {recipe.title}
                    </h5>
                    <p className="card-text text-muted mb-2">
                      <strong>Category:</strong>
                      <span className="ms-1">{recipe.category?.name || "N/A"}</span>
                    </p>
                    <p className="card-text text-muted flex-grow-1">
                      {recipe.description?.substring(0, 100)}...
                    </p>
                    <Link
                      to={`/recipes/${recipe.id}`}
                      className="btn btn-primary btn-sm mt-auto transition-all"
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
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import myaxios from "../utils/myaxios";
import { errorToast } from "../utils/toast";
import Navbar from "./NavBar";
import Footer from "../pages/Footer";
import Loading from "./../components/Loading";

const AllUsers = () => {
  const navigate = useNavigate();

  // State for users, filters, and search
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          errorToast("Please log in to access this page");
          navigate("/login");
          return;
        }

        const response = await myaxios.get("accounts/profile/all/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === "success") {
          setUsers(response.data.data);
          setFilteredUsers(response.data.data);
        } else {
          errorToast("Failed to fetch users");
        }
      } catch (error) {
        errorToast("An error occurred while fetching users");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  // Handle role filter and search
  useEffect(() => {
    let filtered = users;

    // Filter by role
    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [roleFilter, searchQuery, users]);

  return (
    <div>
      <Navbar />
      <div className="container my-5">
        <h2 className="mb-4">All Users</h2>

        {/* Sticky Filter Bar */}
        <div
          className="filter-bar d-flex flex-column flex-md-row justify-content-between align-items-center p-3 mb-4 bg-light shadow-sm"
          style={{
            position: "sticky",
            top: "70px", // Adjust based on your navbar height
            zIndex: 1000,
            borderRadius: "8px",
          }}
        >
          <div className="d-flex flex-column flex-md-row align-items-center mb-2 mb-md-0">
            <label htmlFor="roleFilter" className="me-2 fw-bold">
              Filter by Role:
            </label>
            <select
              id="roleFilter"
              className="form-select w-auto"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Chef">Chef</option>
              <option value="User">User</option>
            </select>
          </div>
          <div className="d-flex align-items-center">
            <label htmlFor="search" className="me-2 fw-bold">
              Search:
            </label>
            <input
              id="search"
              type="text"
              className="form-control w-auto"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Users List */}
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden"><Loading /></span>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <p className="text-center">No users found.</p>
        ) : (
          <div className="row">
            {filteredUsers.map((user) => (
              <div key={user.email} className="col-md-4 mb-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link
                        to={`/dashboard/users/${user.email}`}
                        className="text-primary text-decoration-none"
                      >
                        {user.firstName} {user.lastName}
                      </Link>
                    </h5>
                    <p className="card-text">
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p className="card-text">
                      <strong>Role:</strong>{" "}
                      <span className={`badge bg-${
                        user.role === "Admin" ? "danger" :
                        user.role === "Chef" ? "success" : "secondary"
                      }`}>
                        {user.role}
                      </span>
                    </p>
                    <p className="card-text">
                      <strong>Mobile:</strong> {user.mobile || "N/A"}
                    </p>
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

export default AllUsers;
// src/components/SideBar.jsx
import { NavLink } from "react-router-dom"; // Use NavLink instead of Link
import { useUser } from "../context/UserContext";
import './sidebar.css';

const SideBar = () => {
  const { user } = useUser(); // Access logged-in user data

  return (
    <div className="sidebar-container">
      <NavLink
        to="/dashboard/index/"
        className={({ isActive }) =>
          `side-bar-item ${isActive ? "side-bar-item-active" : ""}`
        }
      >
        <i className="bi bi-graph-up me-2"></i>
        <span className="side-bar-item-caption">Dashboard</span>
      </NavLink>

      <NavLink
        to="/dashboard/user-info/"
        className={({ isActive }) =>
          `side-bar-item ${isActive ? "side-bar-item-active" : ""}`
        }
      >
        <i className="bi bi-person-lines-fill me-2"></i>
        <span className="side-bar-item-caption">User Info</span>
      </NavLink>

      <NavLink
        to="/dashboard/update-profile/"
        className={({ isActive }) =>
          `side-bar-item ${isActive ? "side-bar-item-active" : ""}`
        }
      >
        <i className="bi bi-people me-2"></i>
        <span className="side-bar-item-caption">Update Profile</span>
      </NavLink>

      <NavLink
        to="/dashboard/add-recipe/"
        className={({ isActive }) =>
          `side-bar-item ${isActive ? "side-bar-item-active" : ""}`
        }
      >
        <i className="bi bi-cart-plus-fill me-2"></i>
        <span className="side-bar-item-caption">Add a Recipe</span>
      </NavLink>

      {/* Conditionally render "All Users" tab if user is an Admin */}
      {user?.role === "Admin" && (
        <NavLink
          to="/dashboard/users/"
          className={({ isActive }) =>
            `side-bar-item ${isActive ? "side-bar-item-active" : ""}`
          }
        >
          <i className="bi bi-people-fill me-2"></i>
          <span className="side-bar-item-caption">All Users</span>
        </NavLink>
      )}
    </div>
  );
};

export default SideBar;
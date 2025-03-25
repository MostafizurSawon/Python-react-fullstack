import { NavLink } from "react-router-dom";
import { useUser } from "../context/UserContext";
import './sidebar.css';

const SideBar = () => {
  const { user } = useUser();

  return (
    <div className="sidebar-container">
      <NavLink
        to="/dashboard/index" // Removed trailing slash
        className={({ isActive }) =>
          `side-bar-item ${isActive ? "side-bar-item-active" : ""}`
        }
      >
        <i className="bi bi-graph-up me-2"></i>
        <span className="side-bar-item-caption">Dashboard</span>
      </NavLink>

      <NavLink
        to="/dashboard/user-info" // Removed trailing slash
        className={({ isActive }) =>
          `side-bar-item ${isActive ? "side-bar-item-active" : ""}`
        }
      >
        <i className="bi bi-person-lines-fill me-2"></i>
        <span className="side-bar-item-caption">User Info</span>
      </NavLink>

      <NavLink
        to="/dashboard/update-profile" // Removed trailing slash
        className={({ isActive }) =>
          `side-bar-item ${isActive ? "side-bar-item-active" : ""}`
        }
      >
        <i className="bi bi-people me-2"></i>
        <span className="side-bar-item-caption">Update Profile</span>
      </NavLink>

      <NavLink
        to="/dashboard/add-recipe" // Removed trailing slash
        className={({ isActive }) =>
          `side-bar-item ${isActive ? "side-bar-item-active" : ""}`
        }
      >
        <i className="bi bi-cart-plus-fill me-2"></i>
        <span className="side-bar-item-caption">Add a Recipe</span>
      </NavLink>

      {user?.role === "Admin" && (
        <NavLink
          to="/dashboard/users" // Removed trailing slash
          className={({ isActive }) =>
            `side-bar-item ${isActive ? "side-bar-item-active" : ""}`
          }
        >
          <i className="bi bi-people-fill me-2"></i>
          <span className="side-bar-item-caption">All Users</span>
        </NavLink>
      )}
      {user?.role === "Admin" && (
        <NavLink
          to="/dashboard/messages" 
          className={({ isActive }) =>
            `side-bar-item ${isActive ? "side-bar-item-active" : ""}`
          }
        >
          <i className="bi bi-people-fill me-2"></i>
          <span className="side-bar-item-caption">User Messages</span>
        </NavLink>
      )}
    </div>
  );
};

export default SideBar;
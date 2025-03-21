import { Link } from "react-router";
import './sidebar.css';

const SideBar = () => {
    return (
        <>
            <Link to="/dashboard/index/" className="side-bar-item">
                <i className="bi bi-graph-up"></i>
                <span className="side-bar-item-caption">Dashboard</span>
            </Link>

            {/* <Link to="/dashboard/profile/" className="side-bar-item">
                <span className="side-bar-item-caption">Profile</span>
            </Link> */}
            <Link to="/dashboard/update-profile/" className="side-bar-item">
                <i className="bi bi-people"></i>
                <span className="side-bar-item-caption">Update Profile</span>
            </Link>

            <Link to="/dashboard/add-recipe/" className="side-bar-item">
                <i className="bi bi-cart-plus-fill"></i>
                <span className="side-bar-item-caption">Add a recipe</span>
            </Link>

            <Link to="/dashboard/users/" className="side-bar-item">
                <i className="bi bi-people-fill"></i> {/* Nice icon for users */}
                <span className="side-bar-item-caption">All Users</span>
            </Link>

            {/* <Link to="/dashboard/category/" className="side-bar-item">
                <i className="bi bi-list-nested"></i>
                <span className="side-bar-item-caption">Category</span>
            </Link> */}

            {/* <Link to="/dashboard/product/" className="side-bar-item">
                <i className="bi bi-bag"></i>
                <span className="side-bar-item-caption">Product</span>
            </Link> */}

            {/* <Link to="/dashboard/sale/" className="side-bar-item">
                <i className="bi bi-currency-dollar"></i>
                <span className="side-bar-item-caption">Create Sale</span>
            </Link> */}

            {/* <Link to="/dashboard/invoice/" className="side-bar-item">
                <i className="bi bi-receipt"></i>
                <span className="side-bar-item-caption">Invoice</span>
            </Link> */}

            {/* <Link to="/dashboard/report/" className="side-bar-item">
                <i className="bi bi-file-earmark-bar-graph"></i>
                <span className="side-bar-item-caption">Report</span>
            </Link> */}
        </>
    );
};

export default SideBar;
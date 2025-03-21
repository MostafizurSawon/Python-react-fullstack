import { Link } from "react-router";
import './sidebar.css';

const Navbar = ({ navOpenHandler }) => {
    return (
        <nav className="navbar fixed-top px-0 shadow-sm bg-white">
            <div className="container-fluid">
                <nav className="navbar-brand" >
                    <span className="icon-nav m-0 h5 d-flex justify-content-center align-items-center" onClick={navOpenHandler}>
                        {/* <img className="nav-logo-sm mx-2" src="/images/menu.svg" alt="logo" /> */}
                        <i className="bi bi-aspect-ratio-fill"></i>
                    </span>
                    {/* <img className="nav-logo  mx-2" src="/images/logo.png" alt="logo" /> */}
                </nav>
                    <Link className="h4 text-decoration-none" to="/">RecipeHub</Link>

                <div className="float-right h-auto d-flex">
                    <div className="user-dropdown">
                        <img className="icon-nav-img" src="/images/user.webp" alt="" />
                        <div className="user-dropdown-content ">
                            <div className="mt-4 text-center">
                                <img className="icon-nav-img" src="/images/user.webp" alt="" />
                                <h6>User Name</h6>
                                <hr className="user-dropdown-divider  p-0" />
                            </div>
                            
                            <Link to={`/logout/`} className="side-bar-item">
                                <span className="side-bar-item-caption">Logout</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

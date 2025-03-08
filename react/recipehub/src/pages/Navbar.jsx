import { Link } from "react-router";

const token = localStorage.getItem("token");

const Navbar = () => {
    return (
        <div className="mb-5 pb-4">
            <nav className="navbar fixed-top shadow-sm navbar-expand-lg navbar-light py-2">
                <div className="container">
                    <Link className="navbar-brand h3" to="/">
                        {/* <img className="img-fluid" src="./images/logo.png" alt="" width="96px" /> */}
                        RecipeHub
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#header01" aria-controls="header01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="header01">
                        <ul className="navbar-nav ms-auto mt-3 mt-lg-0 mb-3 mb-lg-0 me-4">
                            <li className="nav-item me-4"><Link className="nav-link" to="/">Home</Link></li>
                            <li className="nav-item me-4"><Link className="nav-link" to="/">Recipe</Link></li>
                            <li className="nav-item me-4"><Link className="nav-link" to="/dashboard/profile">Profile</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/dashboard/index">Dashboard</Link></li>
                        </ul>
                        {token ? <Link className="btn mt-3 bg-gradient-danger"to="/logout/">Logout</Link> : <div>
                            <Link className="btn mt-3 bg-gradient-primary" to="/register">
                                Register
                            </Link>
                            <Link className="btn mt-3 ms-2 bg-gradient-success" to="/login">
                                Login
                            </Link>
                        </div>} 
                        
                    </div>
                </div>
            </nav>


            

            
        </div>
    );
};

export default Navbar;
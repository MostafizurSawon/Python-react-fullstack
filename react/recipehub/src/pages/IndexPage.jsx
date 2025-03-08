import { Link } from "react-router-dom"; // Corrected import for React Router DOM
import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home";
import MainSection from "./MainSection";

const IndexPage = () => {
    return (
        <div>
            <Navbar/>

            <Home />

            <div className="container my-5">
                <MainSection />
            </div>

            <section className="py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-12 col-lg-5 mb-5 mb-lg-0">
                            <h2 className="fw-bold mb-5">Reach Out to Us: Let's Connect and Explore Opportunities Together</h2>
                            <h4 className="fw-bold">Address</h4>
                            <p className="text-muted mb-5">1686 Geraldine Lane New York, NY 10013</p>
                            <h4 className="fw-bold">Contact Us</h4>
                            <p className="text-muted mb-1">hello@recipehub.org</p>
                            <p className="text-muted mb-0">+ 7-843-672-431</p>
                        </div>
                        <div className="col-12 col-lg-6 offset-lg-1">
                            <form action="#">
                                <input className="form-control mb-3" type="text" placeholder="Name" />
                                <input className="form-control mb-3" type="email" placeholder="E-mail" />
                                <textarea className="form-control mb-3" name="message" cols="30" rows="10" placeholder="Your Message..."></textarea>
                                <button className="btn bg-gradient-primary w-100">Action</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default IndexPage;

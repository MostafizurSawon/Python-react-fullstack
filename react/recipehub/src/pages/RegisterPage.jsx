import { useNavigate } from "react-router";
import myaxios from "../utils/myaxios";
import { errorToast, successToast } from "../utils/toast";
import Navbar from "./Navbar";
import Footer from "./Footer";

const RegisterPage = () => {

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const formdata = new FormData(e.target);
        const data = Object.fromEntries(formdata);

        console.log(data);

        myaxios.post(
            "accounts/register/",
            data,
        ).then((response) => {
            if (response.data.status === "success") {
                console.log("success bro!");
                successToast("Registered Successfully!");
                navigate("/login");
            } else {
                navigate("/");
                errorToast("Failed!");
                console.error(response.data);
            }
        }).catch(error => {
            if (error.response) {
                errorToast("Failed, Email already exists!");
                console.error('Error Response:', error.response.data);
                console.error('Status Code:', error.response.status);
            } else if (error.request) {
                console.error('Error Request:', error.request);
            } else {
                console.error('Error:', error.message);
            }
        });
    }

    return (
        <div>
        <Navbar />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-10 center-screen">
                        <div className="card animated fadeIn w-100 p-3">
                            <div className="card-body">
                                <h4>Sign Up</h4>
                                <hr />
                                <div className="container-fluid m-0 p-0">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row m-0 p-0">
                                            <div className="">
                                                <label>Email Address</label>
                                                <input id="email" placeholder="User Email" className="form-control" type="email" name="email" />
                                            </div>
                                            <div className="">
                                                <label>First Name</label>
                                                <input id="firstName" placeholder="First Name" className="form-control" type="text" name="firstName" />
                                            </div>
                                            <div className="">
                                                <label>Last Name</label>
                                                <input id="lastName" placeholder="Last Name" className="form-control" type="text" name="lastName" />
                                            </div>
                                            <div className="">
                                                <label>Password</label>
                                                <input id="password" placeholder="User Password" className="form-control" type="password" name="password" />
                                            </div>
                                            <div className="">
                                                <label>Mobile Number</label>
                                                <input id="mobile" placeholder="Mobile" className="form-control" type="mobile" name="mobile" />
                                            </div>
                                        </div>
                                        <div className="row m-0 p-0">
                                            <div className="">
                                                <button type="submit" className="btn mt-3 w-100  bg-gradient-primary">Register</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default RegisterPage;

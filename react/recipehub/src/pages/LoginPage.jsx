import { Link, useNavigate } from "react-router";
import { useState } from "react";
import myaxios from "../utils/myaxios";
import { errorToast, successToast } from "../utils/toast";
import './secure.css';
import Navbar from "./Navbar";
import Footer from "./Footer";

const LoginPage = () => {
    const navigate = useNavigate();
    const [errorFields, setErrorFields] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formdata = new FormData(e.target);
        const data = Object.fromEntries(formdata);

        console.log("login data -> ", data);

        myaxios.post(
            "/accounts/login",
            data,
        ).then((response) => {
            if (response.data.status === "success") {
                successToast("Logged in Successfully!");
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", data.email);
                console.log(response.data);
                navigate("/dashboard/index/");
            } else {
                errorToast("Invalid credentials, please try again.");
                console.error('login error ->', response.data.message);
                setErrorFields(['email', 'password']);
            }
        }).catch((error) => {
            errorToast("Invalid Credentials! Try Again!");
            console.log('error line ->', error);
            setErrorFields(['email', 'password']);
        });
    }

    return (
        <>
        <Navbar />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-7 animated fadeIn col-lg-6 center-screen">
                        <div className="card w-90  p-4">
                            <div className="card-body">
                                <h4>SIGN IN</h4>
                                <br />
                                <form onSubmit={handleSubmit}>
                                    <div className={`form-group ${errorFields.includes('email') ? 'error' : ''}`}>
                                        <input id="email" placeholder="User Email" className="form-control" type="email" name="email" />
                                    </div>
                                    <br />
                                    <div className={`form-group ${errorFields.includes('password') ? 'error' : ''}`}>
                                        <input id="password" placeholder="User Password" className="form-control" type="password" name="password" />
                                    </div>
                                    <br />
                                    <button type="submit" className="btn w-100 bg-gradient-primary">
                                        Next
                                    </button>
                                    <hr />
                                    <div className="float-end mt-3">
                                        <span>
                                            <Link className="text-center ms-3 h6" to="/register/">
                                                Sign Up
                                            </Link>
                                            <span className="ms-1">|</span>
                                            <Link className="text-center ms-3 h6" to="/reset-password/">
                                                Forget Password
                                            </Link>
                                        </span>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default LoginPage;

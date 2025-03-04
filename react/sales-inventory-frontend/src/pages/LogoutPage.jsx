import { useNavigate, Navigate } from "react-router";
import { errorToast, successToast } from "../utils/toast";

const LogoutPage = () => {
    localStorage.removeItem("token");
    successToast("Logged out!");
    // const navigate = useNavigate();
    // navigate("/login/");
    return <Navigate to="/login/" />;
};

export default LogoutPage;

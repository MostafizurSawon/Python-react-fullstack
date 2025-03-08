import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "./toastify-animations.css";  // Ensure you import your CSS file for the animations

const successToast = (msg) => {
    Toastify({
        gravity: "top", // Change to 'top' for upper placement
        position: "center", // Change to 'center' for center alignment
        text: msg,
        className: "mb-5",
        duration: 3000, // Toast duration in milliseconds
        close: true, // Show close button
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)", // Gradient background
            color: "#ffffff", // Text color
            borderRadius: "8px", // Rounded corners
            boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)", // Box shadow for a more elevated look
            fontWeight: "bold", // Bold text
            padding: "10px 20px", // Padding
            fontFamily: "Arial, sans-serif", // Custom font
            animation: "fadein 0.5s, fadeout 0.5s 2.5s" // Custom animations
        },
    }).showToast();
}

const errorToast = (msg) => {
    Toastify({
        gravity: "top", // Change to 'top' for upper placement
        position: "center", // Change to 'center' for center alignment
        text: msg,
        className: "mb-5",
        duration: 3000, // Toast duration in milliseconds
        close: true, // Show close button
        style: {
            background: "linear-gradient(to right, #f44336, #e57373)", // Gradient background
            color: "#ffffff", // Text color
            borderRadius: "8px", // Rounded corners
            boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)", // Box shadow for a more elevated look
            fontWeight: "bold", // Bold text
            padding: "10px 20px", // Padding
            fontFamily: "Arial, sans-serif", // Custom font
            animation: "fadein 0.5s, fadeout 0.5s 2.5s" // Custom animations
        },
    }).showToast();
}

export { successToast, errorToast };

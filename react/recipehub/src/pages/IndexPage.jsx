import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home";
import MainSection from "./MainSection";
import myaxios from "../utils/myaxios";
import { successToast, errorToast } from "../utils/toast";

const IndexPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await myaxios.post("contact/", formData);
      successToast(response.data.message || "Message sent successfully!");
      setFormData({ name: "", email: "", message: "" }); // Reset form
    } catch (error) {
      console.error("Error submitting contact form:", error.response?.data || error.message);
      errorToast(
        error.response?.data?.message ||
        error.response?.data?.email?.[0] ||
        error.response?.data?.name?.[0] ||
        error.response?.data?.message?.[0] ||
        "Failed to send message."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />

      <Home />

      <div id="main-section" className="container my-5">
        <MainSection />
      </div>

      {/* contact us */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-5 mb-5 mb-lg-0">
              <h2 className="fw-bold mb-5">
                Reach Out to Us: Let's Connect and Explore Opportunities Together
              </h2>
              <h4 className="fw-bold">Address</h4>
              <p className="text-muted mb-5">1686 Geraldine Lane New York, NY 10013</p>
              <h4 className="fw-bold">Contact Us</h4>
              <p className="text-muted mb-1">hello@recipehub.org</p>
              <p className="text-muted mb-0">+ 7-843-672-431</p>
            </div>
            <div className="col-12 col-lg-6 offset-lg-1">
              <form onSubmit={handleSubmit}>
                <input
                  className="form-control mb-3"
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  className="form-control mb-3"
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <textarea
                  className="form-control mb-3"
                  name="message"
                  cols="30"
                  rows="10"
                  placeholder="Your Message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
                <button
                  className="btn bg-gradient-primary w-100"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
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
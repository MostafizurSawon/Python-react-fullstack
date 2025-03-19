import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      className="py-3 py-md-5 py-xl-6"
      style={{
        backgroundColor: "#f8f9fa", // Light background to contrast with the navbar
        color: "#333",
      }}
    >
      {/* Main Footer Section with 4 Columns */}
      <section className="pb-5 pb-md-6 pb-xl-8">
        <div className="container">
          <div className="row gy-3">
            {/* Column 1: About Us */}
            <div className="col-6 col-sm-4 col-lg-3">
              <div className="link-wrapper">
                <h4 className="mb-3 fw-bold fs-6">About Us</h4>
                <ul className="m-0 list-unstyled">
                  <li className="mb-1">
                    <a
                      href="#!"
                      className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-dark"
                    >
                      Our Story
                    </a>
                  </li>
                  <li className="mb-1">
                    <a
                      href="#!"
                      className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-dark"
                    >
                      Our Team
                    </a>
                  </li>
                  <li className="mb-1">
                    <a
                      href="#!"
                      className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-dark"
                    >
                      Our Mission
                    </a>
                  </li>
                  <li className="mb-1">
                    <a
                      href="#!"
                      className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-dark"
                    >
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 2: Recipes */}
            <div className="col-6 col-sm-4 col-lg-3">
              <div className="link-wrapper">
                <h4 className="mb-3 fw-bold fs-6">Recipes</h4>
                <ul className="m-0 list-unstyled">
                  <li className="mb-1">
                    <a
                      href="#!"
                      className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-dark"
                    >
                      Breakfast Ideas
                    </a>
                  </li>
                  <li className="mb-1">
                    <a
                      href="#!"
                      className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-dark"
                    >
                      Lunch Recipes
                    </a>
                  </li>
                  <li className="mb-1">
                    <a
                      href="#!"
                      className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-dark"
                    >
                      Dinner Favorites
                    </a>
                  </li>
                  <li className="mb-1">
                    <a
                      href="#!"
                      className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-dark"
                    >
                      Desserts
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 3: Community */}
            <div className="col-6 col-sm-4 col-lg-3">
              <div className="link-wrapper">
                <h4 className="mb-3 fw-bold fs-6">Community</h4>
                <ul className="m-0 list-unstyled">
                  <li className="mb-1">
                    <a
                      href="#!"
                      className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-dark"
                    >
                      Share Your Recipe
                    </a>
                  </li>
                  <li className="mb-1">
                    <a
                      href="#!"
                      className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-dark"
                    >
                      Join Discussions
                    </a>
                  </li>
                  <li className="mb-1">
                    <a
                      href="#!"
                      className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-dark"
                    >
                      Recipe Contests
                    </a>
                  </li>
                  <li className="mb-1">
                    <a
                      href="#!"
                      className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-dark"
                    >
                      Member Stories
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 4: Support */}
            <div className="col-6 col-sm-4 col-lg-3">
              <div className="link-wrapper">
                <h4 className="mb-3 fw-bold fs-6">Support</h4>
                <ul className="m-0 list-unstyled">
                  <li className="mb-1">
                    <a
                      href="#!"
                      className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-dark"
                    >
                      Help Center
                    </a>
                  </li>
                  <li className="mb-1">
                    <a
                      href="#!"
                      className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-dark"
                    >
                      FAQs
                    </a>
                  </li>
                  <li className="mb-1">
                    <a
                      href="#!"
                      className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-dark"
                    >
                      Contact Support
                    </a>
                  </li>
                  <li className="mb-1">
                    <a
                      href="#!"
                      className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-dark"
                    >
                      Report an Issue
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo and Social Media Section */}
      <div className="pb-3">
        <div className="container">
          <div className="row gy-3 align-items-center">
            <div className="col-12 col-sm-6">
              <div className="footer-logo-wrapper text-center text-sm-start">
                <Link className="navbar-brand h3" to="/">
                  RecipeHub
                </Link>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="social-media-wrapper">
                <ul className="m-0 list-unstyled d-flex justify-content-center justify-content-sm-end gap-2">
                  <li>
                    <a
                      href="#!"
                      className="btn btn-dark bsb-btn-circle bsb-btn-circle-sm link-opacity-75-hover link-light"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-facebook"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#!"
                      className="btn btn-dark bsb-btn-circle bsb-btn-circle-sm link-opacity-75-hover link-light"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-twitter-x"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#!"
                      className="btn btn-dark bsb-btn-circle bsb-btn-circle-sm link-opacity-75-hover link-light"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-linkedin"
                        viewBox="0 0 16 16"
                      >
                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#!"
                      className="btn btn-dark bsb-btn-circle bsb-btn-circle-sm link-opacity-75-hover link-light"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-youtube"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright and Bottom Links */}
      <div>
        <div
          className="container pt-3"
          style={{
            borderTop: "1px solid rgba(139, 0, 0, 0.2)", // Subtle deep red border
          }}
        >
          <div className="row gy-3 align-items-lg-center">
            <div className="col-12 col-lg-6 order-1 order-lg-0">
              <div className="copyright-wrapper d-block mb-1 fs-8 text-center text-lg-start">
                © 2025. All Rights Reserved.
              </div>
              <div className="credit-wrapper d-block text-secondary fs-8 text-center text-lg-start">
                Built by{" "}
                <a
                  href="https://mostafizur.netlify.app/"
                  className="link-secondary text-decoration-none"
                >
                  Mostafizur
                </a>
              </div>
            </div>
            <div className="col-12 col-lg-6 order-0 order-lg-1">
              <div className="link-wrapper">
                <ul className="m-0 list-unstyled d-flex justify-content-center justify-content-lg-end gap-2 gap-md-3">
                  <li>
                    <a
                      href="#!"
                      className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-secondary fs-8 d-flex align-items-center pe-2 pe-md-3 bsb-sep bsb-sep-border"
                    >
                      Terms of Use
                    </a>
                  </li>
                  <li>
                    <a
                      href="#!"
                      className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-secondary fs-8 d-flex align-items-center pe-2 pe-md-3 bsb-sep bsb-sep-border"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#!"
                      className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-secondary fs-8 d-flex align-items-center"
                    >
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
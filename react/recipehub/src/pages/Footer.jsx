

function Footer() {
  return (
    <footer className="py-5 bg-light">
                <div className="container text-center pb-5 border-bottom">
                    <a className="d-inline-block mx-auto mb-4" href="#">
                        <img className="img-fluid" src="./images/logo.png" alt="" width="96px" />
                    </a>
                    <ul className="d-flex flex-wrap justify-content-center align-items-center list-unstyled mb-4">
                        <li><a className="link-secondary me-4" href="#">About</a></li>
                        <li><a className="link-secondary me-4" href="#">Company</a></li>
                        <li><a className="link-secondary me-4" href="#">Services</a></li>
                        <li><a className="link-secondary" href="#">Testimonials</a></li>
                    </ul>
                    <div>
                        <a className="d-inline-block me-4" href="#">
                            <img src="./images/facebook.svg" />
                        </a>
                        <a className="d-inline-block me-4" href="#">
                            <img src="./images/twitter.svg" />
                        </a>
                        <a className="d-inline-block me-4" href="#">
                            <img src="./images/github.svg" />
                        </a>
                        <a className="d-inline-block me-4" href="#">
                            <img src="./images/instagram.svg" />
                        </a>
                        <a className="d-inline-block" href="#">
                            <img src="./images/linkedin.svg" />
                        </a>
                    </div>
                </div>
                <div className="mb-5"></div>
                <div className="container">
                    <p className="text-center"></p>
                </div>
            </footer>
  )
}

export default Footer
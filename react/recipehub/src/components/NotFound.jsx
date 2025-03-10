import { Link } from "react-router-dom"


function NotFound({message}) {
  return (
<section className="py-3 py-md-5 min-vh-100 d-flex justify-content-center align-items-center">
  <div className="container">
    <div className="row">
      <div className="col-12">
        <div className="text-center">
          <h2 className="d-flex justify-content-center align-items-center gap-2 mb-4">
            <span className="display-1 fw-bold">4</span>
            <i className="bi bi-exclamation-circle-fill text-danger display-4"></i>
            <span className="display-1 fw-bold bsb-flip-h">4</span>
          </h2>
          

          {message ? (
            <div>
            <h3 className="h2 mb-2">Oops!</h3>
            <p className="mb-5">No recipe found!</p>
            </div>
          
        
          
        ) : (
          <div>
            <h3 className="h2 mb-2">Oops! You're lost.</h3>
            <p className="mb-5">The page you are looking for was not found.</p>
            
          <Link
            className="btn bsb-btn-5xl btn-dark rounded-pill px-5 fs-6 m-0"
            to="/"
            role="button"
          >
            Back to Home
          </Link>
          </div>
        )}
        </div>
      </div>
    </div>
  </div>
</section>
  )
}

export default NotFound
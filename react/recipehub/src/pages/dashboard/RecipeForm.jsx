// src/components/RecipeForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import myaxios from "./../../utils/myaxios";
import { errorToast, successToast } from "./../../utils/toast";
import { useUser } from "./../../context/UserContext";

const RecipeForm = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, token } = useUser(); // Get user and token from context

    useEffect(() => {
        myaxios.get('recipes/categories')
            .then(response => setCategories(response.data))
            .catch(error => {
                console.error('Error fetching categories:', error);
                errorToast("Failed to load categories.");
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!token) {
            errorToast("Please log in to create a recipe.");
            navigate("/login");
            return;
        }
        setLoading(true);

        const formdata = new FormData(e.target);
        const data = {
            title: formdata.get('title'),
            img: formdata.get('img') || '',
            ingredients: formdata.get('ingredients'),
            instructions: formdata.get('instructions'),
            category: Array.from(document.getElementById('category').selectedOptions).map(option => parseInt(option.value, 10)),
        };

        console.log('Submitting data:', data);

        myaxios.post("recipes/lists/", data)
            .then((response) => {
                if (response.status === 201) {
                    successToast("Recipe created successfully!");
                    e.target.reset();
                    navigate("/"); // Redirect to home
                } else {
                    errorToast("Failed to create recipe!");
                    console.error("Unexpected response:", response.data);
                }
            })
            .catch(error => {
                if (error.response) {
                    console.error('Error Response:', error.response.data);
                    console.error('Status Code:', error.response.status);
                    if (error.response.status === 400) {
                        const errorData = error.response.data;
                        const errorMsg = Object.values(errorData).flat().join(" ") || "Invalid data.";
                        errorToast(`Failed to create recipe: ${errorMsg}`);
                    } else if (error.response.status === 401) {
                        errorToast("Please log in to create a recipe.");
                        navigate("/login");
                    } else {
                        errorToast("An unexpected error occurred. Please try again.");
                    }
                } else if (error.request) {
                    errorToast("No response from the server. Please check your connection.");
                } else {
                    errorToast("An error occurred. Please try again.");
                }
            })
            .finally(() => setLoading(false));
    };

    return (
        <section className="py-5" style={{ background: "linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)" }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="card border-0 shadow-lg rounded-4" style={{ background: "rgba(255, 255, 255, 0.95)", transition: "transform 0.3s ease" }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                            <div className="card-body p-4 p-md-5">
                                <h3 className="text-center text-primary mb-4">Add a New Recipe</h3>
                                {user && (
                                    <p className="text-muted text-center mb-4">
                                        Submitting as {user.firstName} {user.lastName} ({user.email})
                                    </p>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group mb-3">
                                        <label htmlFor="title" className="form-label">Title:</label>
                                        <input type="text" className="form-control" id="title" name="title" placeholder="Recipe Title" required disabled={loading} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="img" className="form-label">Image URL:</label>
                                        <input type="text" className="form-control" id="img" name="img" placeholder="Image URL" disabled={loading} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="ingredients" className="form-label">Ingredients:</label>
                                        <textarea className="form-control" id="ingredients" name="ingredients" placeholder="Recipe Ingredients" rows="3" required disabled={loading}></textarea>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="category" className="form-label">Category:</label>
                                        <select className="form-control" id="category" name="category" multiple required disabled={loading}>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>{category.name}</option>
                                            ))}
                                        </select>
                                        <small className="form-text text-muted">Hold Ctrl/Cmd to select multiple categories</small>
                                    </div>
                                    <div className="form-group mb-4">
                                        <label htmlFor="instructions" className="form-label">Instructions:</label>
                                        <textarea className="form-control" id="instructions" name="instructions" placeholder="Recipe Instructions" rows="3" required disabled={loading}></textarea>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary px-4 py-2" style={{ transition: "background-color 0.3s ease" }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0056b3"}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#007bff"}
                                            disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Submitting...
                                                </>
                                            ) : (
                                                "Submit"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RecipeForm;
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import myaxios from "../../utils/myaxios";
import { errorToast, successToast } from "../../utils/toast";

const RecipeForm = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch categories to populate the category dropdown
        myaxios.get('recipes/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formdata = new FormData(e.target);
        const data = Object.fromEntries(formdata);
        const userEmail = localStorage.getItem('user');

        // Add user email to the data
        data.user = userEmail;

        // Handle category selection
        const categorySelect = document.getElementById('category');
        data.category = Array.from(categorySelect.selectedOptions).map(option => option.value);

        // console.log('-->', data);

        myaxios.post(
            "recipes/lists/",
            data,
        ).then((response) => {
            if (response.status === 201) { // Assuming 201 Created status for successful creation
                successToast("Recipe created successfully!");
                navigate("/"); // Redirect to the desired page after success
            } else {
                errorToast("Failed to create recipe!");
                console.error(response.data);
            }
        }).catch(error => {
            if (error.response) {
                console.error('Error Response:', error.response.data);
                console.error('Status Code:', error.response.status);
            } else if (error.request) {
                console.error('Error Request:', error.request);
            } else {
                console.error('Error:', error.message);
            }
        });
    };

    return (
        <section className="recipe container bg-light shadow">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        placeholder="Recipe Title"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="img">Image URL:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="img"
                        name="img"
                        placeholder="Image URL"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ingredients">Ingredients:</label>
                    <textarea
                        className="form-control"
                        id="ingredients"
                        name="ingredients"
                        placeholder="Recipe Ingredients"
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <select
                        className="form-control"
                        id="category"
                        name="category"
                        multiple
                    >
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="instructions">Instructions:</label>
                    <textarea
                        className="form-control"
                        id="instructions"
                        name="instructions"
                        placeholder="Recipe Instructions"
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </section>
    );
};

export default RecipeForm;

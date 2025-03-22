import { useEffect, useState } from "react";
import { Button, Card, Modal, Form, InputGroup, FormControl, Collapse } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import myaxios from "../../utils/myaxios";
import Loading from "../../components/Loading";
import NotFound from "../../components/NotFound";
import { successToast, errorToast } from "../../utils/toast";

const DashboardIndexPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    category: [],
    img: "",
  });
  const [filterOpen, setFilterOpen] = useState(false); // State for collapsible filter on mobile

  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await myaxios.get("recipes/categories/");
      const cats = response.data.results || response.data;
      setCategories(cats);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchRecipes = async () => {
    setLoading(true);
    let url = "recipes/lists/";
    const params = new URLSearchParams();

    if (selectedCategories.length > 0) {
      params.append("categories", selectedCategories.join(","));
    }
    if (searchQuery) {
      params.append("search", searchQuery);
    }
    url += `?${params.toString()}`;

    try {
      const response = await myaxios.get(url);
      setRecipes(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchRecipes();
  }, [selectedCategories, searchQuery]);

  const handleDelete = async (recipeId) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        await myaxios.delete(`recipes/lists/${recipeId}/`);
        setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
        successToast("Recipe deleted successfully!");
      } catch (error) {
        console.error("Error deleting recipe:", error);
        errorToast("Failed to delete recipe.");
      }
    }
  };

  const handleEdit = (recipe) => {
    setCurrentRecipe(recipe);
    setFormData({
      title: recipe.title || "",
      ingredients: recipe.ingredients || "",
      instructions: recipe.instructions || "",
      category: recipe.category_ids ? recipe.category_ids.map(String) : [],
      img: recipe.img || "",
    });
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({ ...prev, category: selectedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        category: formData.category.map((cat) => parseInt(cat, 10)),
      };
      const response = await myaxios.put(
        `recipes/lists/${currentRecipe.id}/`,
        updatedData
      );
      setRecipes(
        recipes.map((recipe) =>
          recipe.id === currentRecipe.id ? response.data : recipe
        )
      );
      successToast("Recipe updated successfully!");
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating recipe:", error);
      errorToast("Failed to update recipe.");
    }
  };

  const handleCategoryChangeFilter = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const fallbackImage = "https://placehold.co/300x200?text=No+Image";

  return (
    <section
      className="py-5"
      style={{ background: "linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-10">
            <div
              className="card border-0 shadow-lg rounded-4"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div className="card-body p-4 p-md-5">
                <h1
                  className="text-center text-primary mb-5"
                  style={{ fontWeight: "bold" }}
                >
                  My Recipes
                </h1>

                {/* Search Bar */}
                <div className="mb-4 d-flex justify-content-start">
                  <InputGroup className="w-100 w-md-50 w-lg-25">
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <FormControl
                      placeholder="Search my recipes..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </InputGroup>
                </div>

                {/* Main Content Row */}
                <div className="row g-4" style={{ minHeight: "70vh" }}>
                  {/* Filter Panel (Collapsible on Mobile/Tablet) */}
                  <div className="col-12 col-md-4 col-lg-3 order-md-1 order-2">
                    <div className="d-md-none mb-3">
                      <Button
                        variant="outline-primary"
                        onClick={() => setFilterOpen(!filterOpen)}
                        className="w-100 d-flex justify-content-between align-items-center"
                      >
                        <span>Filter by Category</span>
                        <i className={`bi ${filterOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                      </Button>
                      <Collapse in={filterOpen}>
                        <div className="p-3 border rounded mt-2">
                          {categories.length > 0 ? (
                            <>
                              {categories.map((cat) => (
                                <Form.Check
                                  key={cat.id}
                                  type="checkbox"
                                  label={cat.name}
                                  checked={selectedCategories.includes(cat.name)}
                                  onChange={() => handleCategoryChangeFilter(cat.name)}
                                  className="mb-2"
                                />
                              ))}
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={clearFilters}
                                className="mt-3 w-100"
                              >
                                Clear Filters
                              </Button>
                            </>
                          ) : (
                            <p>No categories available.</p>
                          )}
                        </div>
                      </Collapse>
                    </div>
                    <div
                      className="p-3 border rounded d-none d-md-block"
                      style={{
                        position: "sticky",
                        top: "100px",
                        maxHeight: "70vh",
                        overflowY: "auto",
                      }}
                    >
                      <h5 className="mb-3">Filter by Category</h5>
                      {categories.length > 0 ? (
                        <>
                          {categories.map((cat) => (
                            <Form.Check
                              key={cat.id}
                              type="checkbox"
                              label={cat.name}
                              checked={selectedCategories.includes(cat.name)}
                              onChange={() => handleCategoryChangeFilter(cat.name)}
                              className="mb-2"
                            />
                          ))}
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={clearFilters}
                            className="mt-3 w-100"
                          >
                            Clear Filters
                          </Button>
                        </>
                      ) : (
                        <p>No categories available.</p>
                      )}
                    </div>
                  </div>

                  {/* Recipes Section */}
                  <div className="col-12 col-md-12 col-lg-9 order-md-2 order-1">
                    <div className="row g-4">
                      {loading ? (
                        <div className="col-12">
                          <Loading />
                        </div>
                      ) : recipes.length > 0 ? (
                        recipes.map((recipe) => (
                          <div className="col-12 col-sm-6 col-lg-6" key={recipe.id}>
                            <Card className="h-100">
                              <Card.Img
                                variant="top"
                                src={recipe.img || fallbackImage}
                                alt={recipe.title}
                                style={{ height: "200px", objectFit: "cover" }}
                                onError={(e) => (e.target.src = fallbackImage)}
                              />
                              <Card.Body className="d-flex flex-column">
                                <Card.Title>{recipe.title}</Card.Title>
                                <Card.Text>
                                  Category:{" "}
                                  {recipe.category_names?.length > 0
                                    ? recipe.category_names.join(", ")
                                    : "Uncategorized"}
                                </Card.Text>
                                <Card.Text>
                                  Shared on: {new Date(recipe.created_on).toLocaleDateString() || "N/A"}
                                </Card.Text>
                                <div className="mt-auto d-flex gap-2">
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    className="w-50"
                                    onClick={() => handleEdit(recipe)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    className="w-50"
                                    onClick={() => handleDelete(recipe.id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </div>
                        ))
                      ) : (
                        <div className="col-12">
                          <NotFound message="No recipes found." />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="ingredients">
              <Form.Label>Ingredients</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="instructions">
              <Form.Label>Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Select
                multiple
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Hold Ctrl/Cmd to select multiple categories
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="img">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="img"
                value={formData.img}
                onChange={handleChange}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="px-4 py-2"
                style={{ transition: "background-color 0.3s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default DashboardIndexPage;
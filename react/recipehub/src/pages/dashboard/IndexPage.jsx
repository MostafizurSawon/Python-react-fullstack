// import { useEffect, useState } from "react";
// import myaxios from "../../utils/myaxios";

// const DashboardIndexPage = () => {

//     const [data, setData] = useState({
//         product: 0,
//         category: 0,
//         customer: 0,
//         invoice: 0,
//         total: 0,
//         vat: 0,
//         payable: 0
//     });

//     // Use Spread Operator

//     // useEffect(() => {
//     //     myaxios.get("/summary")
//     //         .then((response) => {
//     //             setData(response.data);
//     //         })
//     //         .catch((error) => {
//     //             console.error(error);
//     //         });
//     // }, []);


//     return (
//         <div className="container-fluid">
//             {/* <div className="row">
//                 <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12 animated fadeIn p-2">
//                     <div className="card card-plain h-100 bg-white">
//                         <div className="p-3">
//                             <div className="row">
//                                 <div className="col-9 col-lg-8 col-md-8 col-sm-9">
//                                     <div>
//                                         <h5 className="mb-0 text-capitalize font-weight-bold">
//                                             <span id="product">{data.product}</span>
//                                         </h5>
//                                         <p className="mb-0 text-sm">Product</p>
//                                     </div>
//                                 </div>
//                                 <div className="col-3 col-lg-4 col-md-4 col-sm-3 text-end">
//                                     <div className="icon icon-shape bg-gradient-primary shadow float-end border-radius-md">
//                                         <img className="w-100 " src="/images/icon.svg" />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12 animated fadeIn p-2">
//                     <div className="card card-plain h-100 bg-white">
//                         <div className="p-3">
//                             <div className="row">
//                                 <div className="col-9 col-lg-8 col-md-8 col-sm-9">
//                                     <div>
//                                         <h5 className="mb-0 text-capitalize font-weight-bold">
//                                             <span id="category">{data.category}</span>
//                                         </h5>
//                                         <p className="mb-0 text-sm">Category</p>
//                                     </div>
//                                 </div>
//                                 <div className="col-3 col-lg-4 col-md-4 col-sm-3 text-end">
//                                     <div className="icon icon-shape bg-gradient-primary shadow float-end border-radius-md">
//                                         <img className="w-100 " src="/images/icon.svg" />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12 animated fadeIn p-2">
//                     <div className="card card-plain h-100 bg-white">
//                         <div className="p-3">
//                             <div className="row">
//                                 <div className="col-9 col-lg-8 col-md-8 col-sm-9">
//                                     <div>
//                                         <h5 className="mb-0 text-capitalize font-weight-bold">
//                                             <span id="customer">{data.customer}</span>
//                                         </h5>
//                                         <p className="mb-0 text-sm">Customer</p>
//                                     </div>
//                                 </div>
//                                 <div className="col-3 col-lg-4 col-md-4 col-sm-3 text-end">
//                                     <div className="icon icon-shape bg-gradient-primary shadow float-end border-radius-md">
//                                         <img className="w-100 " src="/images/icon.svg" />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12 animated fadeIn p-2">
//                     <div className="card card-plain h-100  bg-white">
//                         <div className="p-3">
//                             <div className="row">
//                                 <div className="col-9 col-lg-8 col-md-8 col-sm-9">
//                                     <div>
//                                         <h5 className="mb-0 text-capitalize font-weight-bold">
//                                             <span id="invoice">{data.invoice}</span>
//                                         </h5>
//                                         <p className="mb-0 text-sm">Invoice</p>
//                                     </div>
//                                 </div>
//                                 <div className="col-3 col-lg-4 col-md-4 col-sm-3 text-end">
//                                     <div className="icon icon-shape bg-gradient-primary shadow float-end border-radius-md">
//                                         <img className="w-100 " src="/images/icon.svg" />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>


//                 <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12 animated fadeIn p-2">
//                     <div className="card card-plain h-100 bg-white">
//                         <div className="p-3">
//                             <div className="row">
//                                 <div className="col-9 col-lg-8 col-md-8 col-sm-9">
//                                     <div>
//                                         <h5 className="mb-0 text-capitalize font-weight-bold">
//                                             $ <span id="total">{data.total}</span>
//                                         </h5>
//                                         <p className="mb-0 text-sm">Total Sale</p>
//                                     </div>
//                                 </div>
//                                 <div className="col-3 col-lg-4 col-md-4 col-sm-3 text-end">
//                                     <div className="icon icon-shape bg-gradient-primary shadow float-end border-radius-md">
//                                         <img className="w-100 " src="/images/icon.svg" />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>


//                 <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12 animated fadeIn p-2">
//                     <div className="card card-plain h-100  bg-white">
//                         <div className="p-3">
//                             <div className="row">
//                                 <div className="col-9 col-lg-8 col-md-8 col-sm-9">
//                                     <div>
//                                         <h5 className="mb-0 text-capitalize font-weight-bold">
//                                             $ <span id="vat">{data.vat}</span>
//                                         </h5>
//                                         <p className="mb-0 text-sm">Vat Collection</p>
//                                     </div>
//                                 </div>
//                                 <div className="col-3 col-lg-4 col-md-4 col-sm-3 text-end">
//                                     <div className="icon icon-shape bg-gradient-primary shadow float-end border-radius-md">
//                                         <img className="w-100 " src="/images/icon.svg" />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>


//                 <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12 animated fadeIn p-2">
//                     <div className="card card-plain h-100  bg-white">
//                         <div className="p-3">
//                             <div className="row">
//                                 <div className="col-9 col-lg-8 col-md-8 col-sm-9">
//                                     <div>
//                                         <h5 className="mb-0 text-capitalize font-weight-bold">
//                                             $ <span id="payable">{data.payable}</span>
//                                         </h5>
//                                         <p className="mb-0 text-sm">Total Collection</p>
//                                     </div>
//                                 </div>
//                                 <div className="col-3 col-lg-4 col-md-4 col-sm-3 text-end">
//                                     <div className="icon icon-shape bg-gradient-primary shadow float-end border-radius-md">
//                                         <img className="w-100 " src="/images/icon.svg" />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//             </div> */}
            
//         </div>
//     );
// };

// export default DashboardIndexPage;

import { useEffect, useState } from "react";
import { Button, Card, Modal, Form, InputGroup, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import myaxios from "../../utils/myaxios"; 
import Loading from "../../components/Loading";
import NotFound from "../../components/NotFound";
import { successToast, errorToast } from "../../utils/toast";

const DashboardIndexPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]); // For category filter
  const [selectedCategories, setSelectedCategories] = useState([]); // Selected categories
  const [searchQuery, setSearchQuery] = useState(""); // Search input
  const [showEditModal, setShowEditModal] = useState(false); // Modal state
  const [currentRecipe, setCurrentRecipe] = useState(null); // Recipe being edited
  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    category: [],
    img: "",
  });

  const navigate = useNavigate();

  // Fetch categories for filtering and modal
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

  // Fetch user's recipes with filters
  const fetchRecipes = async () => {
    setLoading(true);
    let url = "recipes/lists/"; // Updated to relative path since baseURL is set in myaxios
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

  // Handle delete recipe
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

  // Open edit modal and populate form data
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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({ ...prev, category: selectedOptions }));
  };

  // Handle form submission for editing
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

  // Handle category filter change
  const handleCategoryChangeFilter = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  // Clear filters and search
  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const fallbackImage = "https://placehold.co/300x200?text=No+Image";

  return (
    <div className="container-fluid py-4">
      <h1 className=" mb-5" style={{ fontWeight: "bold", color: "#2c3e50" }}>
        My Recipes
        
      </h1>

      {/* Adjusted Search Bar - Smaller and Shifted Left */}
      <div className="mb-4 d-flex justify-content-start">
        <InputGroup className="w-75" style={{ maxWidth: "400px" }}>
          <InputGroup.Text>
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <FormControl className="ms-2"
            placeholder="Search my recipes..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {/* <Button variant="success" onClick={() => setSearchQuery("")} disabled={!searchQuery}>
            Clear
          </Button> */}
        </InputGroup>
      </div>

      {/* Main Content Row */}
      <div className="row g-4" style={{ minHeight: "70vh" }}>
        {/* Recipes Section (Middle) */}
        <div className="col-12 col-md-8 col-lg-8">
          <div className="row g-4">
            {loading ? (
              <div className="col-12">
                <Loading />
              </div>
            ) : recipes.length > 0 ? (
              recipes.map((recipe) => (
                <div className="col-6" key={recipe.id}>
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

        {/* Fixed Filter Panel (Right Side) */}
        <div className="col-12 col-md-4 col-lg-4">
          <div
            className="p-3 border rounded position-fixed"
            style={{ top: "30%", right: "2%", width: "250px", maxHeight: "60vh", overflowY: "auto" }}
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
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashboardIndexPage;
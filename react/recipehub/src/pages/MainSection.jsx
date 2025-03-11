import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Button, Pagination, Form, InputGroup, FormControl } from 'react-bootstrap';
import myaxios from '../utils/myaxios';
import Loading from './../components/Loading';
import NotFound from './../components/NotFound';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainSection.css';

function MainSection() {
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]); // List of all categories
  const [selectedCategories, setSelectedCategories] = useState([]); // Selected categories for filtering
  const [searchQuery, setSearchQuery] = useState(''); // Search input value

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Fetch categories for the filter panel
  const fetchCategories = async () => {
    try {
      const response = await myaxios.get('/recipes/categories/');
      const cats = response.data.results || response.data;
      setCategories(cats); // Store full category objects
    } catch (error) {
      console.error('Error fetching categories:', error.response ? error.response.data : error.message);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page')) || 1;
    const categoriesFromUrl = searchParams.get('categories') ? searchParams.get('categories').split(',') : [];
    const searchFromUrl = searchParams.get('search') || '';
    setCurrentPage(pageFromUrl);
    setSelectedCategories(categoriesFromUrl);
    setSearchQuery(searchFromUrl);
    fetchRecipes(pageFromUrl, categoriesFromUrl, searchFromUrl);
  }, [searchParams]);

  const fetchRecipes = (page, categories, search) => {
    setLoading(true);
    let url = `recipes/lists/?page=${page}`;
    if (categories.length > 0) {
      url += `&categories=${encodeURIComponent(categories.join(','))}`;
    }
    if (search) {
      url += `&search=${encodeURIComponent(search)}`; // Pass search to backend
    }
    console.log('Fetching recipes from:', url);
    myaxios
      .get(url)
      .then((response) => {
        console.log('All recipe data', response.data);
        setRecipes(response.data.results || response.data);
        const totalItems = response.data.count || response.data.length;
        setTotalPages(Math.ceil(totalItems / 10));
      })
      .catch((error) => {
        console.error('Error fetching the recipes:', error.response ? error.response.data : error.message);
        setRecipes([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const params = { page };
      if (selectedCategories.length > 0) {
        params.categories = selectedCategories.join(',');
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      setSearchParams(params);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCategoryChange = (categoryName) => {
    let updatedCategories;
    if (selectedCategories.includes(categoryName)) {
      updatedCategories = selectedCategories.filter((cat) => cat !== categoryName);
    } else {
      updatedCategories = [...selectedCategories, categoryName];
    }
    setSelectedCategories(updatedCategories);
    const params = { page: 1 }; // Reset to page 1 on filter change
    if (updatedCategories.length > 0) {
      params.categories = updatedCategories.join(',');
    }
    if (searchQuery) {
      params.search = searchQuery;
    }
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
    setSearchParams({ page: 1 }); // Reset to page 1
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    const params = { page: 1 };
    if (selectedCategories.length > 0) {
      params.categories = selectedCategories.join(',');
    }
    if (value) {
      params.search = value;
    }
    setSearchParams(params);
  };

  const handleViewRecipe = (id) => {
    navigate(`/recipes/${id}`);
  };

  const fallbackImage = 'https://placehold.co/300x200?text=No+Image';

  return (
    <div className="container my-4">
      <h1 className="text-center mb-5" style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: '2.5rem' }}>
        Our Recipes
      </h1>
      <div className="main-section-wrapper">
        <div className="row">
          {/* Left Side: Sticky Filter Panel */}
          <div className="col-md-3 mb-4 filter-panel-container">
            <div className="filter-panel sticky-center p-3 border rounded">
              <h5 className="mb-3">Filter by Category</h5>
              {categories.length > 0 ? (
                <div>
                  {categories.map((cat) => (
                    <Form.Check
                      key={cat.id}
                      type="checkbox"
                      id={`category-${cat.id}`}
                      label={cat.name}
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => handleCategoryChange(cat.name)}
                      className="mb-2 custom-checkbox"
                    />
                  ))}
                  <Button variant="secondary" size="sm" onClick={clearFilters} className="mt-3 w-100">
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <p>No categories available.</p>
              )}
            </div>
          </div>
          {/* Right Side: Recipes with Search */}
          <div className="col-md-9">
            <InputGroup className="my-3 ">
              <InputGroup.Text style={{ background: 'none', border: 'none', padding: '10px 16px' }}>
                <i className="bi bi-search" style={{ color: '#34495e' }}></i>
              </InputGroup.Text>
              <FormControl 
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search recipes"
                style={{ border: 'none', padding: '10px 16px' }}
              />
              <Button
                variant="success"
                onClick={() => {
                  setSearchQuery('');
                  const params = { page: 1 };
                  if (selectedCategories.length > 0) {
                    params.categories = selectedCategories.join(',');
                  }
                  setSearchParams(params);
                }}
                style={{ border: 'none', padding: '10px 16px', margin: '6px' }}
                disabled={!searchQuery}
              >
                Clear
              </Button>
            </InputGroup>
            <div className="row g-4">
              {recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <div className="col-md-6 col-lg-6" key={recipe.id}>
                    <Card
                      className="custom-card h-100"
                      style={{
                        borderRadius: '20px',
                        border: '1px solid #e0e0e0',
                        overflow: 'hidden',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        height: '400px', // Fixed height for uniformity
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-10px)';
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
                      }}
                    >
                      <div className="card-image-wrapper">
                        {recipe.img ? (
                          <Card.Img
                            variant="top"
                            src={recipe.img}
                            alt={recipe.title}
                            style={{ height: '220px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = fallbackImage;
                              e.target.onError = null;
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              height: '220px',
                              backgroundColor: '#f8f9fa',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderBottom: '1px solid #e0e0e0',
                            }}
                          >
                            <span style={{ color: '#7f8c8d', fontSize: '1.2rem' }}>No Image Available</span>
                          </div>
                        )}
                        <div className="image-overlay"></div>
                      </div>
                      <Card.Body className="p-4 d-flex flex-column">
                        <Card.Title className="mb-3">
                          <span style={{ fontSize: '1.6rem', color: '#e74c3c' }}>🍳</span>
                          <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#2c3e50', marginLeft: '10px' }}>
                            {recipe.title}
                          </span>
                        </Card.Title>
                        <Card.Text className="text-muted mb-3">
                          <span style={{ fontSize: '1.1rem', color: '#3498db' }}>📋</span>
                          <span style={{ fontSize: '1rem', marginLeft: '8px', fontWeight: '500', color: '#34495e' }}>
                            Category: {recipe.category && recipe.category.length > 0 ? recipe.category.join(', ') : 'Uncategorized'}
                          </span>
                        </Card.Text>
                        <div className="recipe-info mt-auto d-flex justify-content-between align-items-center">
                          <div className="recipe-by">
                            <span style={{ fontSize: '1.2rem', color: '#f39c12' }}>👤</span>
                            <span style={{ fontSize: '0.9rem', color: '#34495e', marginLeft: '8px', fontWeight: '500' }}>
                              Recipe by: {recipe.user?.firstName || 'Unknown'}
                            </span>
                          </div>
                          <div className="shared-date">
                            <span style={{ fontSize: '1.2rem', color: '#f39c12' }}>📅</span>
                            <span style={{ fontSize: '0.9rem', color: '#34495e', marginLeft: '8px', fontWeight: '500' }}>
                              Shared on: {recipe.created_on ? new Date(recipe.created_on).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          className="mt-3 w-100"
                          style={{
                            borderRadius: '12px',
                            backgroundColor: '#e74c3c',
                            borderColor: '#e74c3c',
                            fontWeight: '600',
                            padding: '10px 0',
                            transition: 'background-color 0.3s ease',
                          }}
                          onClick={() => handleViewRecipe(recipe.id)}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c0392b')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e74c3c')}
                        >
                          View Full Recipe
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                ))
              ) : (
                <div className="col-12">{loading ? <Loading /> : <NotFound message="No recipes found for this filter." />}</div>
              )}
            </div>
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-5">
                <Pagination>
                  <Pagination.First
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="custom-pagination"
                  />
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="custom-pagination"
                  />
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                      return (
                        <Pagination.Item
                          key={page}
                          active={page === currentPage}
                          onClick={() => handlePageChange(page)}
                          className="custom-pagination"
                        >
                          {page}
                        </Pagination.Item>
                      );
                    }
                    if (
                      (page === currentPage - 3 && currentPage > 4) ||
                      (page === currentPage + 3 && page < totalPages - 3)
                    ) {
                      return <Pagination.Ellipsis key={page} className="custom-pagination" />;
                    }
                    return null;
                  })}
                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="custom-pagination"
                  />
                  <Pagination.Last
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="custom-pagination"
                  />
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainSection;
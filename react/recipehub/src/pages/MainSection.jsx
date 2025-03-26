import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Button, Pagination, Form, InputGroup, FormControl, Collapse } from 'react-bootstrap';
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
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(true); // Changed to true for default visibility

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const fetchCategories = async () => {
    try {
      const response = await myaxios.get('recipes/categories/');
      const cats = response.data.results || response.data;
      console.log('Fetched categories:', cats);
      setCategories(cats);
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
    const categoriesFromUrl = searchParams.get('categories') ? searchParams.get('categories').split(',').map(id => id.toString()) : [];
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
      url += `&search=${encodeURIComponent(search)}`;
    }
    console.log('Fetching recipes with URL:', url);
    myaxios
      .get(url)
      .then((response) => {
        console.log('Recipes response:', response.data);
        setRecipes(response.data.results || response.data);
        const totalItems = response.data.count || response.data.length || 0;
        setTotalPages(Math.max(1, Math.ceil(totalItems / 10)));
      })
      .catch((error) => {
        console.error('Error fetching the recipes:', error.response ? error.response.data : error.message);
        setRecipes([]);
      })
      .finally(() => setLoading(false));
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
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryChange = (categoryId) => {
    const categoryIdStr = categoryId.toString();
    let updatedCategories;
    if (selectedCategories.includes(categoryIdStr)) {
      updatedCategories = selectedCategories.filter((cat) => cat !== categoryIdStr);
    } else {
      updatedCategories = [...selectedCategories, categoryIdStr];
    }
    setSelectedCategories(updatedCategories);
    const params = { page: 1 };
    if (updatedCategories.length > 0) {
      params.categories = updatedCategories.join(',');
    }
    if (searchQuery) {
      params.search = searchQuery;
    }
    console.log('Updated selected categories:', updatedCategories);
    setSearchParams(params);
    sectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
    setSearchParams({ page: 1 });
    sectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      const params = { page: 1 };
      if (selectedCategories.length > 0) {
        params.categories = selectedCategories.join(',');
      }
      if (value) {
        params.search = value;
      }
      setSearchParams(params);
      if (document.activeElement !== searchInputRef.current) {
        sectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  };

  const handleSearchFocus = () => {
    searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleViewRecipe = (id) => {
    navigate(`/recipes/${id}?fromPage=${currentPage}`);
  };

  const fallbackImage = 'https://placehold.co/300x200?text=No+Image';

  return (
    <div className="container my-4" ref={sectionRef} id="main-section">
      <h1 className="text-center mb-5" style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: 'clamp(2rem, 5vw, 2.5rem)' }}>
        Our Recipes
      </h1>
      <div className="main-section-wrapper">
        <div className="row">
          <div className="col-12 col-md-3 mb-4 filter-panel-container">
            <Button
              variant="outline-primary"
              onClick={() => setIsCategoryPanelOpen(!isCategoryPanelOpen)}
              aria-controls="category-collapse"
              aria-expanded={isCategoryPanelOpen}
              className="d-md-none w-100 mb-3"
            >
              {isCategoryPanelOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <Collapse in={isCategoryPanelOpen || window.innerWidth >= 768}>
              <div id="category-collapse" className="filter-panel-wrapper">
                <div className="filter-panel p-3 border rounded">
                  <h5 className="mb-3">Filter by Category</h5>
                  {categories.length > 0 ? (
                    <div className="category-list">
                      {categories.map((cat) => (
                        <div className="custom-checkbox-wrapper" key={cat.id}>
                          <Form.Check
                            type="checkbox"
                            id={`category-${cat.id}`}
                            label={cat.name}
                            checked={selectedCategories.includes(cat.id.toString())}
                            onChange={() => handleCategoryChange(cat.id)}
                            className="mb-2 px-3 custom-checkbox"
                          />
                        </div>
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
            </Collapse>
          </div>
          <div className="col-12 col-md-9 recipe-content">
            <InputGroup className="my-3">
              <InputGroup.Text style={{ background: 'none', border: 'none', padding: '10px 16px' }}>
                <i className="bi bi-search" style={{ color: '#34495e' }}></i>
              </InputGroup.Text>
              <FormControl
                ref={searchInputRef}
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
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
                  sectionRef.current.scrollIntoView({ behavior: 'smooth' });
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
                  <div className="col-12 col-md-6 col-lg-6" key={recipe.id}>
                    <Card
                      className="custom-card h-100"
                      style={{
                        borderRadius: '20px',
                        border: '1px solid #e0e0e0',
                        overflow: 'hidden',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        height: 'clamp(350px, 50vw, 400px)',
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
                      <Card.Body className="p-3 p-md-4 d-flex flex-column">
                        <Card.Title className="mb-3">
                          <span style={{ fontSize: '1.6rem', color: '#e74c3c' }}>🍳</span>
                          <span style={{ fontSize: 'clamp(1.2rem, 2vw, 1.4rem)', fontWeight: '700', color: '#2c3e50', marginLeft: '10px' }}>
                            {recipe.title}
                          </span>
                        </Card.Title>
                        <Card.Text className="text-muted mb-3">
                          <span style={{ fontSize: '1.1rem', color: '#3498db' }}>📋</span>
                          <span style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1rem)', marginLeft: '8px', fontWeight: '500', color: '#34495e' }}>
                            Category: {recipe.category_names && recipe.category_names.length > 0 ? recipe.category_names.join(', ') : 'Uncategorized'}
                          </span>
                        </Card.Text>
                        <div className="recipe-info mt-auto d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                          <div className="recipe-by mb-2 mb-md-0">
                            <span style={{ fontSize: '1.2rem', color: '#f39c12' }}>👤</span>
                            <span style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', color: '#34495e', marginLeft: '8px', fontWeight: '500' }}>
                              Recipe by: {recipe.user?.firstName || 'Anonymous'} {recipe.user?.lastName || ''}
                            </span>
                          </div>
                          <div className="shared-date">
                            <span style={{ fontSize: '1.2rem', color: '#f39c12' }}>📅</span>
                            <span style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', color: '#34495e', marginLeft: '8 8px', fontWeight: '500' }}>
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
                  <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="custom-pagination" />
                  <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="custom-pagination" />
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)) {
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
                    if ((page === currentPage - 3 && currentPage > 4) || (page === currentPage + 3 && page < totalPages - 3)) {
                      return <Pagination.Ellipsis key={page} className="custom-pagination" />;
                    }
                    return null;
                  })}
                  <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="custom-pagination" />
                  <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className="custom-pagination" />
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
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, ListGroup, Button, Pagination } from 'react-bootstrap';
import myaxios from '../utils/myaxios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainSection.css'; // Import custom CSS

function MainSection() {
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page')) || 1;
    setCurrentPage(pageFromUrl);
  }, [searchParams]);

  const fetchRecipes = (page) => {
    setLoading(true);
    myaxios
      .get(`recipes/lists/?page=${page}`)
      .then((response) => {
        console.log("All recipe data", response.data);
        setRecipes(response.data.results);
        const totalItems = response.data.count;
        setTotalPages(Math.ceil(totalItems / 10));
      })
      .catch((error) => {
        console.error('Error fetching the recipes:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecipes(currentPage);
  }, [currentPage]);

  const splitIngredients = (ingredients) => {
    const regex = /\s*(?=\u09E6-\u09EF+\))/;
    return ingredients
      .split(regex)
      .map((item) => item.trim())
      .filter((item) => item !== '');
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSearchParams({ page });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleViewRecipe = (id) => {
    navigate(`/recipes/${id}`);
  };

  // Fallback image URL or local image path
  const fallbackImage = 'https://via.placeholder.com/300x200?text=No+Image'; // You can replace with a local image like '/images/placeholder.jpg'

  return (
    <div className="container my-4">
      <h1 className="text-center mb-5" style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: '2.5rem' }}>
        Our Recipes
      </h1>
      <div className="row g-4">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div className="col-md-6 col-lg-4" key={recipe.id}>
              <Card
                className="custom-card h-100"
                style={{
                  borderRadius: '20px',
                  border: '1px solid #e0e0e0',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
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
                      style={{
                        height: '220px',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.target.src = fallbackImage; // Switch to fallback on error
                        e.target.onError = null; // Prevent infinite loop
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
                  <Card.Subtitle className="d-flex align-items-center text-muted mb-3">
                    <span style={{ fontSize: '1.2rem', color: '#3498db' }}>📋</span>
                    <span style={{ fontSize: '1rem', marginLeft: '8px', fontWeight: '600' }}>Ingredients</span>
                  </Card.Subtitle>
                  <ListGroup variant="flush" className="mb-3">
                    {splitIngredients(recipe.ingredients).map((item, index) => (
                      <ListGroup.Item
                        key={index}
                        className="py-2"
                        style={{ fontSize: '0.95rem', border: 'none', color: '#7f8c8d' }}
                      >
                        {item}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <Card.Text className="d-flex align-items-start mb-4">
                    <span style={{ fontSize: '1.2rem', color: '#27ae60' }}>ℹ️</span>
                    <span style={{ fontSize: '0.95rem', color: '#7f8c8d', marginLeft: '8px', lineHeight: '1.5' }}>
                      {recipe.instructions.length > 100
                        ? `${recipe.instructions.substring(0, 100)}...`
                        : recipe.instructions}
                    </span>
                  </Card.Text>
                  <Card.Text className="d-flex align-items-center mt-auto">
                    <span style={{ fontSize: '1.2rem', color: '#f39c12' }}>👤</span>
                    <span style={{ fontSize: '0.9rem', color: '#34495e', marginLeft: '8px', fontWeight: '500' }}>
                      {recipe.user?.firstName || 'Unknown'}
                    </span>
                    <span style={{ fontSize: '1.2rem', color: '#f39c12', marginLeft: '12px' }}>📅</span>
                    <span style={{ fontSize: '0.9rem', color: '#34495e', marginLeft: '8px', fontWeight: '500' }}>
                      {recipe.created_on ? new Date(recipe.created_on).toLocaleDateString() : 'N/A'}
                    </span>
                  </Card.Text>
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
          <p className="text-center text-muted">{loading ? 'Loading recipes...' : 'No recipes found.'}</p>
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
                (page === currentPage + 3 && currentPage < totalPages - 3)
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
  );
}

export default MainSection;
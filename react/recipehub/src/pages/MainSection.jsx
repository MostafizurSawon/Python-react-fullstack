import { useState, useEffect } from 'react';
import { Card, ListGroup, Badge, Button } from 'react-bootstrap';
import myaxios from '../utils/myaxios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure this is imported here or in index.js

function MainSection() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    myaxios
      .get('recipes/lists/?page=1')
      .then((response) => {
        console.log(response.data);
        setRecipes(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching the recipes:', error);
      });
  }, []);

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#343a40' }}>
        Our Recipes
      </h1>
      <div className="row g-4">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div className="col-md-6 col-lg-4" key={recipe.id}>
              <Card
                style={{
                  borderRadius: '15px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  transition: 'transform 0.2s',
                }}
                className="h-100"
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {/* Recipe Image */}
                <Card.Img
                  variant="top"
                  src={recipe.img || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={recipe.title}
                  style={{ height: '200px', objectFit: 'cover', borderRadius: '15px 15px 0 0' }}
                />

                {/* Card Body */}
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="d-flex align-items-center mb-3">
                    {/* Fallback to text if icons fail */}
                    <span style={{ fontSize: '1.5rem', color: '#dc3545' }}>&nbsp;🍳&nbsp;</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>{recipe.title}</span>
                  </Card.Title>

                  {/* Ingredients */}
                  <Card.Subtitle className="d-flex align-items-center text-muted mb-2">
                    <span style={{ fontSize: '1.2rem', color: '#007bff' }}>&nbsp;📋&nbsp;</span>
                    Ingredients
                  </Card.Subtitle>
                  <ListGroup variant="flush" className="mb-3">
                    {recipe.ingredients.split(', ').map((item, index) => (
                      <ListGroup.Item key={index} className="py-1" style={{ fontSize: '0.9rem' }}>
                        {item}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                  {/* Instructions */}
                  <Card.Text className="d-flex align-items-start mb-3">
                    <span style={{ fontSize: '1.2rem', color: '#28a745' }}>&nbsp;ℹ️&nbsp;</span>
                    <span style={{ fontSize: '0.95rem' }}>
                      {recipe.instructions.length > 100
                        ? `${recipe.instructions.substring(0, 100)}...`
                        : recipe.instructions}
                    </span>
                  </Card.Text>

                  {/* Created On */}
                  <Card.Text className="text-muted d-flex align-items-center mt-auto">
                    <span style={{ fontSize: '1.2rem' }}>&nbsp;📅&nbsp;</span>
                    <small>
                      Created: {recipe.created_on ? new Date(recipe.created_on).toLocaleDateString() : 'N/A'}
                    </small>
                  </Card.Text>

                  {/* Optional Button */}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="mt-2 w-100"
                    style={{ borderRadius: '10px' }}
                  >
                    View Recipe
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">Loading recipes...</p>
        )}
      </div>
    </div>
  );
}

export default MainSection;
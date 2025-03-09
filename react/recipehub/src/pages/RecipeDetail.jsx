import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, ListGroup } from 'react-bootstrap';
import myaxios from '../utils/myaxios';
import Navbar from './Navbar';
import Footer from './Footer';
import NotFound from '../components/NotFound';
import Loading from '../components/Loading';

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const splitIngredients = (ingredients) => {
    const regex = /\s*(?=\u09E6-\u09EF+\))/;
    return ingredients
      .split(regex)
      .map((item) => item.trim())
      .filter((item) => item !== '');
  };

  useEffect(() => {
    setLoading(true);
    myaxios
      .get(`recipes/lists/${id}/`)
      .then((response) => {
        console.log("got recipe details!");
        setRecipe(response.data);
      })
      .catch((error) => {
        console.error('Error fetching recipe details:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Loading/>;
  if (!recipe) return <NotFound/>;

  return (
    <>
    <Navbar/>
    <br />

    <div className="container my-4" style={{ maxWidth: '800px' }}>
      <Card style={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Card.Img
          variant="top"
          src={recipe.img || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={recipe.title}
          style={{ height: '400px', objectFit: 'cover', borderRadius: '15px 15px 0 0' }}
        />
        <Card.Body>
          <Card.Title className="d-flex align-items-center mb-3">
            <span style={{ fontSize: '1.5rem', color: '#dc3545' }}>🍳</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '600' }}>{recipe.title}</span>
          </Card.Title>
          <Card.Subtitle className="d-flex align-items-center text-muted mb-2">
            <span style={{ fontSize: '1.2rem', color: '#007bff' }}>📋</span>
            Ingredients
          </Card.Subtitle>
          <ListGroup variant="flush" className="mb-3">
            {splitIngredients(recipe.ingredients).map((item, index) => (
              <ListGroup.Item key={index} className="py-1" style={{ fontSize: '1rem' }}>
                {item}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Card.Subtitle className="d-flex align-items-center text-muted mb-2">
            <span style={{ fontSize: '1.2rem', color: '#28a745' }}>ℹ️</span>
            Instructions
          </Card.Subtitle>
          <Card.Text style={{ fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
            {recipe.instructions}
          </Card.Text>
          <Card.Text className="text-muted d-flex align-items-center mt-3">
            <span style={{ fontSize: '1.2rem' }}>📅</span>
            <small>
              Created: {recipe.created_on ? new Date(recipe.created_on).toLocaleDateString() : 'N/A'}
            </small>
          </Card.Text>
          <Button variant="outline-secondary"
            className="w-100 mt-3"
            style={{ borderRadius: '10px' }}
            onClick={() => navigate(-1)}
          >
            Back to Recipes
          </Button>
        </Card.Body>
      </Card>
    </div>
    <Footer/>
    </>
  );
}

export default RecipeDetail;
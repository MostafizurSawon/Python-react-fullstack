import { useState, useEffect } from 'react';
import Slider from "react-slick";
import { Card, Badge } from 'react-bootstrap';
import { HeartFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import myaxios from '../utils/myaxios';
import Loading from '../components/Loading';
import { errorToast } from '../utils/toast';

// Slick slider CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    setLoading(true);
    myaxios.get('recipes/lists/most_liked/')
      .then(response => {
        console.log("Most liked recipes response:", response.data);
        setRecipes(response.data);
      })
      .catch(error => {
        console.error('Error fetching most liked recipes:', error);
        errorToast("Failed to load trending recipes.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="my-5 pt-5">
      <div className="container">
        <h1 className="mb-4" style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2c3e50', textAlign: 'center' }}>
          Trending Recipes
        </h1>
        {recipes.length > 0 ? (
          <Slider {...settings}>
            {recipes.map(recipe => (
              <div key={recipe.id} className="p-3">
                <Card
                  className="shadow-lg"
                  style={{
                    borderRadius: '20px',
                    border: 'none',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
                    cursor: 'pointer',
                    transition: 'transform 0.3s',
                  }}
                  onClick={() => navigate(`/recipes/${recipe.id}`)}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
                >
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={recipe.img || 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={recipe.title}
                      style={{
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '20px 20px 0 0',
                        filter: 'brightness(0.95)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '50%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                      }}
                    />
                  </div>
                  <Card.Body className="p-3">
                    <Card.Title className="d-flex align-items-center mb-3">
                      <span style={{ fontSize: '1.5rem', color: '#e74c3c' }}>🍳</span>
                      <span
                        style={{
                          fontSize: '1.3rem',
                          fontWeight: '600',
                          color: '#2c3e50',
                          marginLeft: '10px',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                        }}
                      >
                        {recipe.title}
                      </span>
                    </Card.Title>
                    <Card.Text className="d-flex align-items-center mb-2">
                      <span style={{ fontSize: '1.1rem', color: '#3498db' }}>📋</span>
                      <span
                        style={{
                          fontSize: '0.9rem',
                          marginLeft: '8px',
                          fontWeight: '500',
                          color: '#34495e',
                          background: '#eef2f7',
                          padding: '3px 10px',
                          borderRadius: '10px',
                        }}
                      >
                        Category: {recipe.category_names && recipe.category_names.length > 0 ? recipe.category_names.join(', ') : 'Uncategorized'}
                      </span>
                    </Card.Text>
                    <div className="d-flex align-items-center">
                      <HeartFill size={18} color="#e74c3c" />
                      <Badge
                        bg="light"
                        text="dark"
                        className="ms-2"
                        style={{ fontSize: '0.9rem', padding: '5px 10px', borderRadius: '10px' }}
                      >
                        {recipe.reaction_counts?.LIKE || 0} Likes
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-center text-muted mt-4">No trending recipes available.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
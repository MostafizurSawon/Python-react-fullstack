import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, ListGroup, Modal, Form, Badge, FormControl } from 'react-bootstrap';
import { PencilSquare, Trash, Heart, HeartFill, Chat, Bookmark, BookmarkFill, Star, StarFill } from 'react-bootstrap-icons';
import myaxios from '../utils/myaxios';
import Navbar from './Navbar';
import Footer from './Footer';
import NotFound from '../components/NotFound';
import Loading from '../components/Loading';
import { errorToast, successToast } from "../utils/toast";
import { useUser } from "../context/UserContext";
import './RecipeDetail.css';

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useUser();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    category: [],
    img: '',
  });
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reactionCounts, setReactionCounts] = useState({});
  const [userReaction, setUserReaction] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [reviewBody, setReviewBody] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  // Extract the fromPage query parameter for pagination
  const query = new URLSearchParams(location.search);
  const fromPage = parseInt(query.get('fromPage')) || 1;

  const fetchRecipeDetails = async () => {
    try {
      const response = await myaxios.get(`recipes/lists/${id}/`);
      const data = response.data;
      console.log('Fetched recipe with comments:', data);
      setRecipe(data);
      setFormData({
        title: data.title || '',
        ingredients: data.ingredients || '',
        instructions: data.instructions || '',
        category: data.category_ids ? data.category_ids.map(id => id.toString()) : [],
        img: data.img || '',
      });
      setReactionCounts(data.reaction_counts || {});
      setComments(data.comments || []);
      setLiked(data.is_liked_by_user || false);
      setSaved(data.is_saved_by_user || false);
      setUserReaction(data.user_reaction || null);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      errorToast("Failed to load recipe details.");
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await myaxios.get(`recipes/reviews/?recipe=${id}`);
      setReviews(response.data);
      if (user) {
        const existingReview = response.data.find(review => review.reviewer.id === user.id);
        if (existingReview) {
          setUserReview(existingReview);
          setReviewBody(existingReview.body);
          setReviewRating(existingReview.rating); // Now an integer (1-5)
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      errorToast("Failed to load reviews.");
    }
  };

  useEffect(() => {
    setLoading(true);
    myaxios.get('recipes/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
    fetchRecipeDetails();
    fetchReviews();
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category.length) {
      errorToast("Please select at least one category.");
      return;
    }
    try {
      const updatedData = { ...formData, category: formData.category.map(cat => parseInt(cat, 10)) };
      const response = await myaxios.put(`recipes/lists/${id}/`, updatedData);
      setRecipe(response.data);
      successToast("Recipe Updated Successfully!");
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating recipe:', error);
      errorToast("Failed to update recipe.");
    }
  };

  const handleDelete = async () => {
    try {
      await myaxios.delete(`recipes/lists/${id}/`);
      successToast("Recipe deleted successfully!");
      setShowDeleteModal(false);
      // Fetch the total number of recipes to determine the new total pages
      const response = await myaxios.get('recipes/lists/');
      const totalRecipes = response.data.count;
      const pageSize = 10; // Should match backend page_size
      const newTotalPages = Math.ceil(totalRecipes / pageSize);
      const redirectPage = Math.min(fromPage, newTotalPages) || 1;
      navigate(`/recipes?page=${redirectPage}`);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      errorToast("Failed to delete recipe.");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      errorToast("Please log in to submit a review.");
      navigate('/login');
      return;
    }

    if (reviewRating < 1 || reviewRating > 5) {
      errorToast("Please select a rating between 1 and 5 stars.");
      return;
    }

    const reviewData = {
      recipe: parseInt(id), // Ensure recipe ID is an integer
      body: reviewBody || '', // Send empty string if body is empty
      rating: reviewRating, // Send the integer rating (1-5)
    };

    try {
      const request = userReview
        ? myaxios.put(`recipes/reviews/${userReview.id}/`, reviewData)
        : myaxios.post('recipes/reviews/', reviewData);
      const response = await request;
      if (userReview) {
        successToast("Review updated successfully!");
      } else {
        successToast("Review submitted successfully!");
        setUserReview(response.data);
      }
      setReviewBody(response.data.body);
      setReviewRating(response.data.rating); // Already an integer
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response && error.response.status === 400) {
        // Extract and display the detailed error message from the backend
        const errorMessage = error.response.data.body || error.response.data.rating || error.response.data.detail || "Failed to submit review.";
        errorToast(errorMessage);
      } else {
        errorToast("Failed to submit review.");
      }
    }
  };

  const handleReaction = async (reactionType) => {
    if (!token) {
      errorToast("Please log in to react to this recipe.");
      navigate("/login");
      return;
    }

    try {
      const response = await myaxios.post(`recipes/lists/${id}/like/`, { reaction_type: reactionType });
      if (response.data.status === 'reaction removed') {
        setUserReaction(null);
        setReactionCounts(prev => ({
          ...prev,
          [reactionType]: (prev[reactionType] || 1) - 1,
        }));
      } else {
        setUserReaction(reactionType);
        setReactionCounts(prev => {
          const newCounts = { ...prev };
          Object.keys(newCounts).forEach(key => {
            if (key !== reactionType && newCounts[key] > 0 && userReaction === key) {
              newCounts[key] -= 1;
            }
          });
          newCounts[reactionType] = (newCounts[reactionType] || 0) + (userReaction ? 0 : 1);
          return newCounts;
        });
      }
      setShowReactions(false);
      successToast(response.data.status);
    } catch (error) {
      console.error('Error adding reaction:', error);
      errorToast("Failed to add reaction.");
    }
  };

  const splitIngredients = (ingredients) => ingredients.split('\n').map(item => item.trim()).filter(item => item).map(item => item.match(/^\d+\)/) ? item : `. ${item}`);
  const splitInstructions = (instructions) => instructions.split('\n').map(item => item.trim()).filter(item => item).map(item => item.startsWith('☘️') ? item : `☘️ ${item}`);

  const handleEdit = () => setShowEditModal(true);
  const handleModalClose = () => setShowEditModal(false);
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleCategoryChange = (e) => setFormData(prev => ({ ...prev, category: Array.from(e.target.selectedOptions, opt => opt.value) }));

  const handleLike = async () => {
    if (!token) {
      errorToast("Please log in to like this recipe.");
      navigate("/login");
      return;
    }
    try {
      await myaxios.post(`recipes/lists/${id}/like/`, { reaction_type: 'LIKE' });
      setLiked(!liked);
      setReactionCounts(prev => ({
        ...prev,
        LIKE: liked ? (prev.LIKE || 1) - 1 : (prev.LIKE || 0) + 1,
      }));
      setUserReaction(liked ? null : 'LIKE');
      successToast(liked ? "Recipe unliked!" : "Recipe liked!");
    } catch (error) {
      console.error('Error liking recipe:', error);
      errorToast("Failed to like recipe.");
    }
  };

  const handleSave = async () => {
    if (!token) {
      errorToast("Please log in to save this recipe.");
      navigate("/login");
      return;
    }
    try {
      await myaxios.post(`recipes/lists/${id}/save/`);
      setSaved(!saved);
      successToast(saved ? "Recipe unsaved!" : "Recipe saved!");
    } catch (error) {
      console.error('Error saving recipe:', error);
      errorToast("Failed to save recipe.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      errorToast("Please log in to comment.");
      navigate("/login");
      return;
    }
    if (!newComment.trim()) return;
    try {
      console.log('Posting comment for recipe ID:', id, 'with payload:', { content: newComment });
      const response = await myaxios.post(`recipes/lists/${id}/comments/`, { content: newComment });
      console.log('Comment POST response:', response.status, response.data);
      if (response.status === 201) {
        setComments(prev => [...prev, response.data]);
        setNewComment('');
        successToast("Comment added!");
        await new Promise(resolve => setTimeout(resolve, 1000));
        await fetchRecipeDetails();
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error('Error adding comment:', error.response ? error.response.data : error.message);
      errorToast("Failed to add comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await myaxios.delete(`recipes/lists/${id}/comments/${commentId}/`);
        setComments(prev => prev.filter(comment => comment.id !== commentId));
        successToast("Comment deleted!");
      } catch (error) {
        console.error('Error deleting comment:', error);
        errorToast("Failed to delete comment.");
      }
    }
  };

  if (loading) return <Loading />;
  if (!recipe) return <NotFound />;

  const isOwner = user && recipe.user && user.email === recipe.user.email;

  return (
    <>
      <Navbar />
      <br />
      <div className="container my-4" style={{ maxWidth: '900px' }}>
        <Card className="shadow-lg" style={{ borderRadius: '20px', border: 'none', overflow: 'hidden', background: 'linear-gradient(135deg, #ffffff, #f8f9fa)' }}>
          <div className="position-relative">
            <Card.Img variant="top" src={recipe.img || 'https://via.placeholder.com/300x200?text=No+Image'} alt={recipe.title} style={{ height: '450px', objectFit: 'cover', borderRadius: '20px 20px 0 0', filter: 'brightness(0.95)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: '0', right: 0, height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
          </div>
          <Card.Body className="p-4">
            <Card.Title className="d-flex align-items-center mb-4">
              <span style={{ fontSize: '2rem', color: '#e74c3c' }}>🍳</span>
              <span style={{ fontSize: '1.8rem', fontWeight: '700', color: '#2c3e50', marginLeft: '15px', textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>{recipe.title}</span>
            </Card.Title>
            <Card.Text className="mb-3 d-flex align-items-center">
              <span style={{ fontSize: '1.3rem', color: '#3498db' }}>📋</span>
              <span style={{ fontSize: '1.1rem', marginLeft: '10px', fontWeight: '500', color: '#34495e', background: '#eef2f7', padding: '4px 12px', borderRadius: '12px' }}>
                Category: {recipe.category_names && recipe.category_names.length > 0 ? recipe.category_names.join(', ') : 'Uncategorized'}
              </span>
            </Card.Text>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex gap-3 position-relative">
                <div
                  onMouseEnter={() => setShowReactions(true)}
                  onMouseLeave={() => setTimeout(() => setShowReactions(false), 300)}
                >
                  <Button
                    variant={userReaction ? 'danger' : 'outline-danger'}
                    className="d-flex align-items-center gap-2 action-btn"
                    style={{ borderRadius: '12px', padding: '8px 16px', transition: 'all 0.3s' }}
                    onClick={() => handleReaction('LIKE')}
                  >
                    {userReaction ? (
                      userReaction === 'LIKE' ? '👍' :
                      userReaction === 'LOVE' ? '❤️' :
                      userReaction === 'WOW' ? '😮' :
                      '😢'
                    ) : <Heart size={20} />}
                    <span>{userReaction || 'Like'}</span>
                    <Badge bg="light" text="dark">{reactionCounts.LIKE || 0}</Badge>
                  </Button>
                  {showReactions && (
                    <div
                      className="position-absolute d-flex bg-light border rounded p-1"
                      style={{ zIndex: 10, top: '-50px' }}
                      onMouseEnter={() => setShowReactions(true)}
                      onMouseLeave={() => setTimeout(() => setShowReactions(false), 300)}
                    >
                      <Button className="btn btn-sm btn-light mx-1" onClick={() => handleReaction('LIKE')}>
                        👍 Like
                      </Button>
                      <Button className="btn btn-sm btn-light mx-1" onClick={() => handleReaction('LOVE')}>
                        ❤️ Love
                      </Button>
                      <Button className="btn btn-sm btn-light mx-1" onClick={() => handleReaction('WOW')}>
                        😮 Wow
                      </Button>
                      <Button className="btn btn-sm btn-light mx-1" onClick={() => handleReaction('SAD')}>
                        😢 Sad
                      </Button>
                    </div>
                  )}
                </div>
                <Button variant="outline-primary" className="d-flex align-items-center gap-2 action-btn" style={{ borderRadius: '12px', padding: '8px 16px', transition: 'all 0.3s' }} onClick={() => document.getElementById('comments-section').scrollIntoView({ behavior: 'smooth' })}>
                  <Chat size={20} />
                  <Badge bg="light" text="dark">{comments.length}</Badge>
                </Button>
                <Button variant="outline-success" className="d-flex align-items-center gap-2 action-btn" style={{ borderRadius: '12px', padding: '8px 16px', transition: 'all 0.3s' }} onClick={handleSave}>
                  {saved ? <BookmarkFill size={20} /> : <Bookmark size={20} />}
                  <span>{saved ? 'Saved' : 'Save'}</span>
                </Button>
              </div>
            </div>
            <Card.Subtitle className="d-flex align-items-center text-muted mb-3">
              <span style={{ fontSize: '1.4rem', color: '#3498db' }}>📋</span>
              <span style={{ fontSize: '1.2rem', marginLeft: '10px', fontWeight: '600', color: '#2c3e50' }}>Ingredients</span>
            </Card.Subtitle>
            <ListGroup variant="flush" className="mb-4">
              {splitIngredients(recipe.ingredients).map((item, index) => (
                <ListGroup.Item key={index} className="py-2" style={{ fontSize: '1rem', border: 'none', color: '#7f8c8d', background: '#f9f9f9', borderRadius: '8px', marginBottom: '8px', padding: '12px' }}>
                  {item}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Card.Subtitle className="d-flex align-items-center text-muted mb-3">
              <span style={{ fontSize: '1.4rem', color: '#27ae60' }}>ℹ️</span>
              <span style={{ fontSize: '1.2rem', marginLeft: '10px', fontWeight: '600', color: '#2c3e50' }}>Instructions</span>
            </Card.Subtitle>
            <ListGroup variant="flush" className="mb-4">
              {splitInstructions(recipe.instructions).map((item, index) => (
                <ListGroup.Item key={index} className="py-2" style={{ fontSize: '1rem', border: 'none', color: '#7f8c8d', background: '#f9f9f9', borderRadius: '8px', marginBottom: '8px', padding: '12px' }}>
                  {item}
                </ListGroup.Item>
              ))}
            </ListGroup>
            {/* Review Form */}
            {user && (
              <div className="mb-4">
                <h5 className="d-flex align-items-center mb-3">
                  <span style={{ fontSize: '1.4rem', color: '#f39c12' }}>⭐</span>
                  <span style={{ fontSize: '1.2rem', marginLeft: '10px', fontWeight: '600', color: '#2c3e50' }}>
                    {userReview ? 'Edit Your Review' : 'Add a Review'}
                  </span>
                </h5>
                <Form onSubmit={handleReviewSubmit}>
                  <Form.Group className="mb-3" controlId="reviewBody">
                    <Form.Label>Review (Optional):</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={reviewBody}
                      onChange={(e) => setReviewBody(e.target.value)}
                      placeholder="Write your review..."
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="reviewRating">
                    <Form.Label>Rating (1-5):</Form.Label>
                    <div className="d-flex align-items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => setReviewRating(star)}
                          style={{ cursor: 'pointer', fontSize: '1.5rem', marginRight: '5px' }}
                        >
                          {star <= reviewRating ? (
                            <StarFill color="#f39c12" />
                          ) : (
                            <Star color="#d3d3d3" />
                          )}
                        </span>
                      ))}
                    </div>
                  </Form.Group>
                  <Button type="submit" variant="primary" style={{ borderRadius: '12px', padding: '10px 20px' }}>
                    {userReview ? 'Update Review' : 'Submit Review'}
                  </Button>
                </Form>
              </div>
            )}
            {/* Display Reviews */}
            <div className="mb-4">
              <h5 className="d-flex align-items-center mb-3">
                <span style={{ fontSize: '1.4rem', color: '#f39c12' }}>📝</span>
                <span style={{ fontSize: '1.2rem', marginLeft: '10px', fontWeight: '600', color: '#2c3e50' }}>Reviews</span>
              </h5>
              <ListGroup variant="flush">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <ListGroup.Item key={review.id} className="mb-3" style={{ border: 'none', background: '#f9f9f9', borderRadius: '12px', padding: '15px' }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong style={{ color: '#34495e' }}>
                            {review.reviewer?.firstName ? `${review.reviewer.firstName} ${review.reviewer.lastName || ''}` : 'Anonymous'}
                          </strong>
                          <small style={{ color: '#7f8c8d', marginLeft: '10px' }}>
                            {new Date(review.created).toLocaleString('en-US', { timeZone: 'UTC' })}
                          </small>
                          <div>
                            <span style={{ color: '#f39c12' }}>{'★'.repeat(review.rating)}</span>
                            <span style={{ color: '#d3d3d3' }}>{'★'.repeat(5 - review.rating)}</span>
                          </div>
                        </div>
                      </div>
                      <p style={{ color: '#7f8c8d', marginTop: '5px' }}>{review.body || 'No comment provided.'}</p>
                    </ListGroup.Item>
                  ))
                ) : (
                  <p style={{ color: '#7f8c8d', textAlign: 'center' }}>No reviews yet. Be the first to review!</p>
                )}
              </ListGroup>
            </div>
            <div id="comments-section" className="mt-5">
              <h5 className="d-flex align-items-center mb-3">
                <span style={{ fontSize: '1.4rem', color: '#3498db' }}>💬</span>
                <span style={{ fontSize: '1.2rem', marginLeft: '10px', fontWeight: '600', color: '#2c3e50' }}>Comments</span>
              </h5>
              <Form onSubmit={handleCommentSubmit} className="mb-4">
                <div className="d-flex gap-2">
                  <FormControl placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} style={{ borderRadius: '12px', padding: '10px' }} />
                  <Button type="submit" variant="primary" style={{ borderRadius: '12px', padding: '10px 20px' }}>Post</Button>
                </div>
              </Form>
              <ListGroup variant="flush">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <ListGroup.Item key={comment.id} className="mb-3" style={{ border: 'none', background: '#f9f9f9', borderRadius: '12px', padding: '15px', position: 'relative' }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong style={{ color: '#34495e' }}>
                            {comment.user?.email === user?.email
                              ? `${user?.firstName || 'Anonymous'} ${user?.lastName || ''}`
                              : `${comment.user?.firstName || 'Anonymous'} ${comment.user?.lastName || ''}`}
                          </strong>
                          <small style={{ color: '#7f8c8d', marginLeft: '10px' }}>
                            {new Date(comment.created).toLocaleString('en-US', { timeZone: 'UTC' })}
                          </small>
                        </div>
                        {comment.can_delete && (
                          <Button variant="danger" size="sm" className="comment-delete-btn" onClick={() => handleDeleteComment(comment.id)} style={{ padding: '4px 10px', position: 'absolute', top: '10px', right: '10px' }}>
                            <Trash size={14} />
                          </Button>
                        )}
                      </div>
                      <p style={{ color: '#7f8c8d', marginTop: '5px' }}>{comment.content}</p>
                    </ListGroup.Item>
                  ))
                ) : (
                  <p style={{ color: '#7f8c8d', textAlign: 'center' }}>No comments yet. Be the first to comment!</p>
                )}
              </ListGroup>
            </div>
            <div className="recipe-info d-flex justify-content-between align-items-center mb-4 p-3" style={{ background: '#eef2f7', borderRadius: '12px' }}>
              <div className="recipe-by d-flex align-items-center">
                <span style={{ fontSize: '1.4rem', color: '#f39c12' }}>👤</span>
                <span style={{ fontSize: '1rem', color: '#34495e', marginLeft: '10px', fontWeight: '500' }}>
                  By: {recipe.user?.firstName ? `${recipe.user.firstName} ${recipe.user.lastName || ''}` : 'Anonymous'}
                </span>
              </div>
              <div className="shared-date d-flex align-items-center">
                <span style={{ fontSize: '1.4rem', color: '#f39c12' }}>📅</span>
                <span style={{ fontSize: '1rem', color: '#34495e', marginLeft: '10px', fontWeight: '500' }}>
                  Created: {recipe.created_on ? new Date(recipe.created_on).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
            <div className="d-flex justify-content-between gap-3">
              <Button variant="outline-secondary" className="w-100" style={{ borderRadius: '12px', padding: '10px', fontWeight: '600', transition: 'all 0.3s' }} onClick={() => navigate(-1)}>
                Back to Recipes
              </Button>
              {isOwner && (
                <>
                  <Button variant="primary" className="w-100 action-btn" style={{ borderRadius: '12px', padding: '10px', fontWeight: '600', backgroundColor: '#3498db', borderColor: '#3498db', transition: 'all 0.3s' }} onClick={handleEdit}>
                    <PencilSquare size={18} className="me-2" />
                    Edit Recipe
                  </Button>
                  <Button variant="danger" className="w-100 action-btn" style={{ borderRadius: '12px', padding: '10px', fontWeight: '600', transition: 'all 0.3s' }} onClick={() => setShowDeleteModal(true)}>
                    <Trash size={18} className="me-2" />
                    Delete Recipe
                  </Button>
                </>
              )}
            </div>
          </Card.Body>
        </Card>
        <Modal show={showEditModal} onHide={handleModalClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Recipe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="ingredients">
                <Form.Label>Ingredients</Form.Label>
                <Form.Control as="textarea" rows={3} name="ingredients" value={formData.ingredients} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="instructions">
                <Form.Label>Instructions</Form.Label>
                <Form.Control as="textarea" rows={3} name="instructions" value={formData.instructions} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Select multiple name="category" value={formData.category} onChange={handleCategoryChange}>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">Hold Ctrl/Cmd to select multiple categories</Form.Text>
              </Form.Group>
              <Form.Group className="mb-3" controlId="img">
                <Form.Label>Image URL</Form.Label>
                <Form.Control type="text" name="img" value={formData.img} onChange={handleChange} />
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
                <Button variant="primary" type="submit">Save Changes</Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete the recipe "{recipe.title}"? This action cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <Footer />
    </>
  );
}

export default RecipeDetail;
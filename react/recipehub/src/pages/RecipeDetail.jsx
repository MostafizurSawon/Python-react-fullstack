import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, ListGroup, Modal, Form, Badge, FormControl, Alert } from 'react-bootstrap';
import { PencilSquare, Trash, Heart, Chat, Bookmark, BookmarkFill, Star, StarFill } from 'react-bootstrap-icons';
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
  const [showReactionsModal, setShowReactionsModal] = useState(false);
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
  const [activeTab, setActiveTab] = useState('ingredients');
  const [reactionsList, setReactionsList] = useState([]);

  const query = new URLSearchParams(location.search);
  const fromPage = parseInt(query.get('fromPage')) || 1;

  const fetchRecipeDetails = async () => {
    try {
      const response = await myaxios.get(`recipes/lists/${id}/`);
      const data = response.data;
      setRecipe(data);
      const categoryIds = data.category
        ? data.category.map(id => id.toString())
        : [];
      setFormData({
        title: data.title || '',
        ingredients: data.ingredients || '',
        instructions: data.instructions || '',
        category: categoryIds,
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
      if (user && user.email) {
        // Match the review by the user's email instead of ID to handle potential mismatches
        const existingReview = response.data.find(review => review.reviewer.email === user.email);
        if (existingReview) {
          setUserReview(existingReview);
          setReviewBody(existingReview.body || '');
          setReviewRating(existingReview.rating || 5);
        } else {
          setUserReview(null);
          setReviewBody('');
          setReviewRating(5);
        }
      } else {
        setUserReview(null);
        setReviewBody('');
        setReviewRating(5);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      errorToast("Failed to load reviews.");
    }
  };

  const fetchReactions = async () => {
    try {
      const response = await myaxios.get(`recipes/reactions/?recipe=${id}`);
      setReactionsList(response.data);
    } catch (error) {
      console.error('Error fetching reactions:', error);
      errorToast("Failed to load reactions.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoriesResponse = await myaxios.get('recipes/categories');
        setCategories(categoriesResponse.data);
        await fetchRecipeDetails();
        await fetchReviews();
        await fetchReactions();
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchData();
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category.length) {
      errorToast("Please select at least one category.");
      return;
    }
    try {
      const updatedData = {
        ...formData,
        category_ids: formData.category.map(cat => parseInt(cat, 10)),
      };
      delete updatedData.category;
      const response = await myaxios.put(`recipes/lists/${id}/`, updatedData);
      setRecipe(response.data);
      successToast("Recipe Updated Successfully!");
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating recipe:', error);
      if (error.response && error.response.status === 400) {
        errorToast(error.response.data.category_ids || "Failed to update recipe.");
      } else {
        errorToast("Failed to update recipe.");
      }
    }
  };

  const handleDelete = async () => {
    try {
      await myaxios.delete(`recipes/lists/${id}/`);
      successToast("Recipe deleted successfully!");
      setShowDeleteModal(false);

      const response = await myaxios.get('recipes/lists/');
      const totalRecipes = response.data.count || 0;
      const pageSize = 10;
      const newTotalPages = Math.max(1, Math.ceil(totalRecipes / pageSize));

      let redirectPage = fromPage;
      if (redirectPage > newTotalPages) redirectPage = newTotalPages;
      else if (redirectPage < 1) redirectPage = 1;

      const categories = query.get('categories') || '';
      const search = query.get('search') || '';

      const params = { page: redirectPage };
      if (categories) params.categories = categories;
      if (search) params.search = search;

      navigate(`/?${new URLSearchParams(params).toString()}`);
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
      recipe: parseInt(id),
      body: reviewBody || '',
      rating: reviewRating,
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
      setReviewBody(response.data.body || '');
      setReviewRating(response.data.rating || 5);
      await fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.body || error.response.data.rating || error.response.data.detail || "Failed to submit review.";
        errorToast(errorMessage);
      } else {
        errorToast("Failed to submit review.");
      }
    }
  };

  const handleDeleteReview = async () => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      try {
        await myaxios.delete(`recipes/reviews/${userReview.id}/`);
        successToast("Review deleted successfully!");
        setUserReview(null);
        setReviewBody('');
        setReviewRating(5);
        await fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
        errorToast("Failed to delete review.");
      }
    }
  };

  const handleCancelEditReview = () => {
    if (userReview) {
      setReviewBody(userReview.body || '');
      setReviewRating(userReview.rating || 5);
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
      fetchReactions();
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
      const response = await myaxios.post(`recipes/lists/${id}/comments/`, { content: newComment });
      if (response.status === 201) {
        setComments(prev => [...prev, response.data]);
        setNewComment('');
        successToast("Comment added!");
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

  const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + (count || 0), 0);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
  };

  if (loading) return <Loading />;
  if (!recipe) return <NotFound />;

  const canEditOrDelete = (user && recipe.user && user.email === recipe.user.email) || (user && user.role === 'Admin');

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
            <div className="reaction-section">
              <div className="reaction-buttons">
                <div className="reaction-wrapper">
                  <Button
                    className="reaction-btn reaction-like"
                    onMouseEnter={() => setShowReactions(true)}
                    onMouseLeave={() => setShowReactions(false)}
                    onClick={() => handleReaction('LIKE')}
                  >
                    {userReaction ? (
                      userReaction === 'LIKE' ? '👍' :
                      userReaction === 'LOVE' ? '❤️' :
                      userReaction === 'WOW' ? '😮' :
                      '😢'
                    ) : <Heart size={20} />}
                    <span className="reaction-count">{totalReactions}</span>
                  </Button>
                  {showReactions && (
                    <div
                      className="reaction-menu"
                      onMouseEnter={() => setShowReactions(true)}
                      onMouseLeave={() => setShowReactions(false)}
                    >
                      <Button className="reaction-icon" onClick={() => handleReaction('LIKE')}>
                        👍
                      </Button>
                      <Button className="reaction-icon" onClick={() => handleReaction('LOVE')}>
                        ❤️
                      </Button>
                      <Button className="reaction-icon" onClick={() => handleReaction('WOW')}>
                        😮
                      </Button>
                    </div>
                  )}
                </div>
                <Button
                  className="reaction-btn reaction-comment"
                  onClick={() => document.getElementById('comments-section').scrollIntoView({ behavior: 'smooth' })}
                >
                  <Chat size={20} />
                  <span className="reaction-count">{comments.length}</span>
                </Button>
                <Button
                  className="reaction-btn reaction-save"
                  onClick={handleSave}
                >
                  {saved ? <BookmarkFill size={20} /> : <Bookmark size={20} />}
                  <span className="reaction-label">{saved ? 'SAVED' : 'SAVE'}</span>
                </Button>
              </div>
              <div className="reaction-summary">
                <Button
                  className="view-reactions-btn">
                  Total Reactions: {totalReactions}
                </Button>
                <Button
                  className="view-reactions-btn"
                  onClick={() => setShowReactionsModal(true)}
                >
                  <span role="img" aria-label="view reactions">👀</span> View Reactions
                </Button>
              </div>
            </div>
            <div className="recipe-tabs mb-4">
              <div className="d-flex justify-content-center border-bottom">
                <div
                  className={`tab-item d-flex align-items-center ${activeTab === 'ingredients' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ingredients')}
                >
                  <span style={{ fontSize: '1.4rem', color: '#3498db' }}>📋</span>
                  <span style={{ fontSize: '1.2rem', marginLeft: '10px', fontWeight: '600', color: '#2c3e50' }}>
                    Ingredients
                  </span>
                </div>
                <div
                  className={`tab-item d-flex align-items-center ${activeTab === 'instructions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('instructions')}
                >
                  <span style={{ fontSize: '1.4rem', color: '#27ae60' }}>ℹ️</span>
                  <span style={{ fontSize: '1.2rem', marginLeft: '10px', fontWeight: '600', color: '#2c3e50' }}>
                    Instructions
                  </span>
                </div>
              </div>
              <div className="tab-content mt-3">
                {activeTab === 'ingredients' ? (
                  <ListGroup variant="flush">
                    {splitIngredients(recipe.ingredients).map((item, index) => (
                      <ListGroup.Item key={index} className="py-2" style={{ fontSize: '1rem', border: 'none', color: '#7f8c8d', background: '#f9f9f9', borderRadius: '8px', marginBottom: '8px', padding: '12px' }}>
                        {item}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <ListGroup variant="flush">
                    {splitInstructions(recipe.instructions).map((item, index) => (
                      <ListGroup.Item key={index} className="py-2" style={{ fontSize: '1rem', border: 'none', color: '#7f8c8d', background: '#f9f9f9', borderRadius: '8px', marginBottom: '8px', padding: '12px' }}>
                        {item}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </div>
            </div>
            <div className="mb-4">
              <h5 className="d-flex align-items-center mb-3">
                <span style={{ fontSize: '1.4rem', color: '#f39c12' }}>⭐</span>
                <span style={{ fontSize: '1.2rem', marginLeft: '10px', fontWeight: '600', color: '#2c3e50' }}>
                  {user && userReview ? 'Your Review' : 'Add a Review'}
                </span>
              </h5>
              {!user ? (
                <Alert variant="info" className="d-flex align-items-center justify-content-between">
                  <span>Please log in to submit a review for this recipe.</span>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/login')}
                    style={{ borderRadius: '12px', padding: '8px 16px' }}
                  >
                    Log In
                  </Button>
                </Alert>
              ) : (
                <>
                  {userReview && (user.email === userReview.reviewer.email || user.role === 'Admin') && (
                    <Alert variant="success" className="mb-3">
                      You have already reviewed this recipe. You can edit or delete your review below.
                    </Alert>
                  )}
                  <Form onSubmit={handleReviewSubmit}>
                    <Form.Group className="mb-3" controlId="reviewBody">
                      <Form.Label>Review (Optional):</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={reviewBody}
                        onChange={(e) => setReviewBody(e.target.value)}
                        placeholder="Write your review..."
                        disabled={userReview && user.email !== userReview.reviewer.email && user.role !== 'Admin'}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="reviewRating">
                      <Form.Label>Rating (1-5):</Form.Label>
                      <div className="d-flex align-items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            onClick={() => setReviewRating(star)}
                            style={{ cursor: userReview && user.email !== userReview.reviewer.email && user.role !== 'Admin' ? 'default' : 'pointer', fontSize: '1.5rem', marginRight: '5px' }}
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
                    <div className="d-flex gap-2">
                      <Button
                        type="submit"
                        variant="primary"
                        style={{ borderRadius: '12px', padding: '10px 20px' }}
                        disabled={userReview && user.email !== userReview.reviewer.email && user.role !== 'Admin'}
                      >
                        {userReview ? 'Edit Review' : 'Submit Review'}
                      </Button>
                      {userReview && (user.email === userReview.reviewer.email || user.role === 'Admin') && (
                        <>
                          <Button
                            variant="secondary"
                            style={{ borderRadius: '12px', padding: '10px 20px' }}
                            onClick={handleCancelEditReview}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="danger"
                            style={{ borderRadius: '12px', padding: '10px 20px' }}
                            onClick={handleDeleteReview}
                          >
                            Delete Review
                          </Button>
                        </>
                      )}
                    </div>
                  </Form>
                </>
              )}
            </div>
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
                            {formatDate(review.created)}
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
                            {formatDate(comment.created)}
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
                  Created: {recipe.created_on ? formatDate(recipe.created_on) : 'N/A'}
                </span>
              </div>
            </div>
            <div className="d-flex justify-content-between gap-3 flex-wrap">
              <Button variant="outline-secondary" className="w-100 w-md-auto" style={{ borderRadius: '12px', padding: '10px', fontWeight: '600', transition: 'all 0.3s' }} onClick={() => navigate(-1)}>
                Back to Recipes
              </Button>
              {canEditOrDelete && (
                <>
                  <Button variant="primary" className="w-100 w-md-auto action-btn" style={{ borderRadius: '12px', padding: '10px', fontWeight: '600', backgroundColor: '#3498db', borderColor: '#3498db', transition: 'all 0.3s' }} onClick={handleEdit}>
                    <PencilSquare size={18} className="me-2" />
                    Edit Recipe
                  </Button>
                  <Button variant="danger" className="w-100 w-md-auto action-btn" style={{ borderRadius: '12px', padding: '10px', fontWeight: '600', transition: 'all 0.3s' }} onClick={() => setShowDeleteModal(true)}>
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
        <Modal show={showReactionsModal} onHide={() => setShowReactionsModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Reactions</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {reactionsList.length > 0 ? (
              <ListGroup variant="flush">
                {reactionsList.map((reaction, index) => (
                  <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong style={{ color: '#34495e' }}>
                        {reaction.user?.firstName ? `${reaction.user.firstName} ${reaction.user.lastName || ''}` : 'Anonymous'}
                      </strong>
                      {reaction.created_on && (
                        <small style={{ color: '#7f8c8d', marginLeft: '10px' }}>
                          {formatDate(reaction.created_on)}
                        </small>
                      )}
                    </div>
                    <span>
                      {reaction.reaction_type === 'LIKE' ? '👍' :
                       reaction.reaction_type === 'LOVE' ? '❤️' :
                       reaction.reaction_type === 'WOW' ? '😮' :
                       '😢'}
                    </span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p style={{ color: '#7f8c8d', textAlign: 'center' }}>No reactions yet.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowReactionsModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <Footer />
    </>
  );
}

export default RecipeDetail;
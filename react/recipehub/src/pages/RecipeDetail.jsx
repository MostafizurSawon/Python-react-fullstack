import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, ListGroup, Modal, Form, Badge, FormControl } from 'react-bootstrap';
import { PencilSquare, Trash, Heart, HeartFill, Chat, Bookmark, BookmarkFill } from 'react-bootstrap-icons';
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
  const { user, token } = useUser();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const fetchRecipeDetails = async () => {
    try {
      const response = await myaxios.get(`recipes/lists/${id}/`);
      const data = response.data;
      console.log('Recipe details response:', data);
      console.log('Comments in response:', data.comments);
      setRecipe(data);
      setFormData({
        title: data.title || '',
        ingredients: data.ingredients || '',
        instructions: data.instructions || '',
        category: data.category_ids ? data.category_ids.map(id => id.toString()) : [],
        img: data.img || '',
      });
      setLikesCount(data.reaction_counts?.LIKE || 0);
      setComments(data.comments || []);
      setLiked(data.is_liked_by_user || false);
      setSaved(data.is_saved_by_user || false);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      errorToast("Failed to load recipe details.");
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    myaxios.get('recipes/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
    fetchRecipeDetails();
  }, [id]);

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
      setShowModal(false);
    } catch (error) {
      console.error('Error updating recipe:', error);
      errorToast("Failed to update recipe.");
    }
  };

  const splitIngredients = (ingredients) => ingredients.split('\n').map(item => item.trim()).filter(item => item).map(item => item.match(/^\d+\)/) ? item : `. ${item}`);
  const splitInstructions = (instructions) => instructions.split('\n').map(item => item.trim()).filter(item => item).map(item => item.startsWith('☘️') ? item : `☘️ ${item}`);

  const handleEdit = () => setShowModal(true);
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await myaxios.delete(`recipes/lists/${id}/`);
        navigate('/recipes');
      } catch (error) {
        console.error('Error deleting recipe:', error);
        errorToast('Failed to delete recipe');
      }
    }
  };
  const handleModalClose = () => setShowModal(false);
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleCategoryChange = (e) => setFormData(prev => ({ ...prev, category: Array.from(e.target.selectedOptions, opt => opt.value) }));

  const handleLike = async () => {
    if (!token) {
      errorToast("Please log in to like this recipe.");
      navigate("/login");
      return;
    }
    try {
      await myaxios.post(`recipes/lists/${id}/like/`);
      setLiked(!liked);
      setLikesCount(prev => liked ? prev - 1 : prev + 1);
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
      const response = await myaxios.post(`recipes/lists/${id}/comments/`, { content: newComment });
      console.log('Comment POST response:', response.status, response.data);
      if (response.status === 201) {
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
            <div style={{ position: 'absolute', bottom: 0, left: '0', right: '0', height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
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
              <div className="d-flex gap-3">
                <Button variant="outline-danger" className="d-flex align-items-center gap-2 action-btn" style={{ borderRadius: '12px', padding: '8px 16px', transition: 'all 0.3s' }} onClick={handleLike}>
                  {liked ? <HeartFill size={20} /> : <Heart size={20} />}
                  <Badge bg="light" text="dark">{likesCount}</Badge>
                </Button>
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
                              ? `${user?.firstName || ''} ${user?.lastName || ''}`
                              : `${comment.user?.firstName || ''} ${comment.user?.lastName || ''}` || 'Anonymous'}
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
                  By: {recipe.user?.firstName || 'Unknown'} {recipe.user?.lastName || ''}
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
                  <Button variant="danger" className="w-100 action-btn" style={{ borderRadius: '12px', padding: '10px', fontWeight: '600', transition: 'all 0.3s' }} onClick={handleDelete}>
                    <Trash size={18} className="me-2" />
                    Delete Recipe
                  </Button>
                </>
              )}
            </div>
          </Card.Body>
        </Card>
        <Modal show={showModal} onHide={handleModalClose} centered size="lg">
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
      </div>
      <Footer />
    </>
  );
}

export default RecipeDetail;
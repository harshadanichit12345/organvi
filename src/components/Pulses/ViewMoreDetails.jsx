import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Leaf, Shield } from 'lucide-react';
import './ViewMoreDetails.css';

// Import product images
import chanadalImg from '../../assets/chanadal.png';
import masoorDalImg from '../../assets/Masoor Dal.png';
import moongdalImg from '../../assets/moongdal.png';
import toordalImg from '../../assets/toordal.png';
import uraldalImg from '../../assets/uraldal.png';
import roastchanaImg from '../../assets/roastchana1.png';
import mixSproutsImg from '../../assets/Mix Sprouts.png';
import backSideImg from '../../assets/chanadal_backside.jpg';

const ViewMoreDetails = ({ product, onClose }) => {
  const navigate = useNavigate();
  const [selectedWeight, setSelectedWeight] = useState('500g');
  const [quantity, setQuantity] = useState(1);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [showAskQuestion, setShowAskQuestion] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('reviews');
  const [sortBy, setSortBy] = useState('Most Recent');
  
  // Review form state
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    rating: 0,
    title: '',
    body: '',
    reviewImage: null,
    recommend: false
  });
  
  // Question form state
  const [questionForm, setQuestionForm] = useState({
    name: '',
    email: '',
    question: ''
  });

  const weightOptions = [
    { value: '500g', label: '500g', multiplier: 1 },
    { value: '1kg', label: '1kg', multiplier: 2 },
    { value: '2kg', label: '2kg', multiplier: 4 }
  ];

  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(product.image);

  // Calculate review statistics
  const getReviewStats = () => {
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;

    reviews.forEach(review => {
      ratingCounts[review.rating]++;
      totalRating += review.rating;
    });

    const averageRating = (totalRating / reviews.length).toFixed(1);
    
    return {
      averageRating: parseFloat(averageRating),
      totalReviews: reviews.length,
      ratingCounts
    };
  };

  const reviewStats = getReviewStats();

  const toggleDropdown = (dropdownName) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName]
    }));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    // Create new review object
    const newReview = {
      id: Date.now(), // Simple ID generation
      name: reviewForm.name,
      rating: reviewForm.rating,
      comment: reviewForm.body,
      productImage: product.image,
      title: reviewForm.title,
      recommend: reviewForm.recommend,
      reviewImage: reviewForm.reviewImage
    };
    
    // Add review to reviews array
    setReviews(prevReviews => [...prevReviews, newReview]);
    
    console.log('Review submitted:', newReview);
    setShowWriteReview(false);
    setReviewForm({
      name: '',
      email: '',
      rating: 0,
      title: '',
      body: '',
      reviewImage: null,
      recommend: false
    });
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    console.log('Question submitted:', questionForm);
    setShowAskQuestion(false);
    setQuestionForm({
      name: '',
      email: '',
      question: ''
    });
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
    setShowSortDropdown(false);
  };

  // Sort reviews based on selected sort option
  const getSortedReviews = () => {
    if (!reviews || reviews.length === 0) return [];

    const sortedReviews = [...reviews];

    switch (sortBy) {
      case 'Most Recent':
        return sortedReviews.sort((a, b) => b.id - a.id); // Higher ID = more recent
      
      case 'Highest Rating':
        return sortedReviews.sort((a, b) => b.rating - a.rating);
      
      case 'Lowest Rating':
        return sortedReviews.sort((a, b) => a.rating - b.rating);
      
      case 'Only Pictures':
        return sortedReviews.filter(review => review.reviewImage && review.reviewImage.type && review.reviewImage.type.startsWith('image/'));
      
      case 'Pictures First':
        return sortedReviews.sort((a, b) => {
          const aHasImage = a.reviewImage && a.reviewImage.type && a.reviewImage.type.startsWith('image/');
          const bHasImage = b.reviewImage && b.reviewImage.type && b.reviewImage.type.startsWith('image/');
          if (aHasImage && !bHasImage) return -1;
          if (!aHasImage && bHasImage) return 1;
          return b.id - a.id; // Most recent for same type
        });
      
      case 'Picture first rating wise':
        return sortedReviews.sort((a, b) => {
          const aHasImage = a.reviewImage && a.reviewImage.type && a.reviewImage.type.startsWith('image/');
          const bHasImage = b.reviewImage && b.reviewImage.type && b.reviewImage.type.startsWith('image/');
          if (aHasImage && !bHasImage) return -1;
          if (!aHasImage && bHasImage) return 1;
          return b.rating - a.rating; // Higher rating for same type
        });
      
      default:
        return sortedReviews;
    }
  };

  const sortedReviews = getSortedReviews();

  const handleReviewImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReviewForm({...reviewForm, reviewImage: file});
    }
  };

  const getFilePreview = (file) => {
    if (!file) return null;
    
    const url = URL.createObjectURL(file);
    return url;
  };

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (reviewForm.reviewImage) {
        URL.revokeObjectURL(getFilePreview(reviewForm.reviewImage));
      }
    };
  }, [reviewForm.reviewImage]);

  const handleAddToCart = () => {
    const weightOption = weightOptions.find(opt => opt.value === selectedWeight);
    const price = Math.round(product.price * weightOption.multiplier);
    const originalPrice = Math.round(product.originalPrice * weightOption.multiplier);
    
    const cartItem = {
      id: `${product.id}-${selectedWeight}`,
      name: product.name,
      price: price,
      originalPrice: originalPrice,
      image: product.image,
      weight: selectedWeight,
      quantity: quantity
    };
    
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = existingCart.findIndex(item => item.id === cartItem.id);
    
    if (existingItemIndex === -1) {
      const updatedCart = [...existingCart, cartItem];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const updatedCart = existingCart.map(item =>
        item.id === cartItem.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
    
    // Trigger cart update event for navbar with updated cart count and success message
    const updatedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const successMessage = `✅ ${product.name} added to cart successfully!`;
    
    // Debug: Show alert to confirm function is called
    alert(`Adding ${product.name} to cart! Cart count: ${updatedCart.length}`);
    
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: updatedCart.length,
      message: successMessage
    }));
    
    // Close the ViewMoreDetails modal and navigate to cart page
    onClose();
    navigate('/cart');
  };

  if (!product) {
    return null;
  }

  return (
    <div className="view-more-overlay" onClick={onClose}>
      <div className="view-more-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Main Content */}
        <div className="view-more-main">
          {/* Left Side - Product Images */}
          <div className="product-images-section">
            <div className="main-product-image">
              <img src={selectedImage} alt={product.name} />
            </div>
            <div className="product-image-gallery">
              <div className="image-row">
                <img 
                  src={product.image} 
                  alt={`${product.name} - Front`} 
                  className="gallery-image" 
                  onClick={() => setSelectedImage(product.image)}
                />
                <img 
                  src={backSideImg} 
                  alt={`${product.name} - Back`} 
                  className="gallery-image" 
                  onClick={() => setSelectedImage(backSideImg)}
                />
              </div>
            </div>
          </div>

          {/* Right Side - Product Information */}
          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-pricing">
              <span className="current-price">₹{product.price}</span>
              <span className="original-price">₹{product.originalPrice}</span>
              <span className="discount">({product.discount}% Off)</span>
            </div>

            <div className="product-description">
              <h3>Product Description</h3>
              <p>Premium quality organic {product.name.toLowerCase()} sourced from the finest organic farms. Rich in nutrients and free from harmful pesticides. Perfect for healthy cooking and nutrition.</p>
              <ul className="product-features-list">
                <li>100% Organic & Natural</li>
                <li>Rich in Protein & Fiber</li>
                <li>No Pesticides or Chemicals</li>
                <li>Premium Quality</li>
                <li>Fresh & Clean</li>
              </ul>
            </div>

            <div className="product-options">
              <div className="weight-selector">
                <label>Weight:</label>
                <select value={selectedWeight} onChange={(e) => setSelectedWeight(e.target.value)}>
                  {weightOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} - ₹{Math.round(product.price * option.multiplier)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>
            </div>

            <div className="product-actions">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart - ₹{Math.round(product.price * weightOptions.find(opt => opt.value === selectedWeight).multiplier) * quantity}
              </button>
              <button className="buy-now-btn">
                BUY NOW
              </button>
            </div>

          </div>
        </div>

        {/* Product Information Section */}
        <div className="product-information">
          <div className="info-item">
            <div className="info-header" onClick={() => toggleDropdown('idealForMaking')}>
              <span className="info-label">Ideal For Making</span>
              <span className="info-arrow">{openDropdowns.idealForMaking ? '▲' : '▼'}</span>
            </div>
            <div className={`info-content ${!openDropdowns.idealForMaking ? 'collapsed' : ''}`}>
              <p>Traditional Indian dal recipes, soups, curries, and healthy meals.</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-header" onClick={() => toggleDropdown('shelfLife')}>
              <span className="info-label">Shelf Life</span>
              <span className="info-arrow">{openDropdowns.shelfLife ? '▲' : '▼'}</span>
            </div>
            <div className={`info-content ${!openDropdowns.shelfLife ? 'collapsed' : ''}`}>
              <p>12 months from date of packaging. Store in cool, dry place.</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-header" onClick={() => toggleDropdown('fssaiNumber')}>
              <span className="info-label">FSSAI Number</span>
              <span className="info-arrow">{openDropdowns.fssaiNumber ? '▲' : '▼'}</span>
            </div>
            <div className={`info-content ${!openDropdowns.fssaiNumber ? 'collapsed' : ''}`}>
              <p>FSSAI License No: 10019051003029</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-header" onClick={() => toggleDropdown('manufacturer')}>
              <span className="info-label">Mfg. / Mktd. by</span>
              <span className="info-arrow">{openDropdowns.manufacturer ? '▲' : '▼'}</span>
            </div>
            <div className={`info-content ${!openDropdowns.manufacturer ? 'collapsed' : ''}`}>
              <p><strong>ORGANVI AGRO IND PVT.LTD.</strong></p>
              <p>H. No. 4-1-170, MARKET YARD, SHOP NO 3, DAM ROAD,</p>
              <p>UDGIR DIST LATUR MH 413517 IN</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="why-choose-us">
          <h2>Why Choose Us</h2>
          <div className="why-choose-content">
            <div className="feature-card">
              <div className="feature-icon">
                <Home size={40} />
              </div>
              <h4>Premium Quality</h4>
              <ul>
                <li>Handpicked and carefully selected</li>
                <li>Fresh and natural products</li>
                <li>Best quality assurance</li>
              </ul>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Leaf size={40} />
              </div>
              <h4>Go Organic</h4>
              <ul>
                <li>Genuine Products</li>
                <li>Chemical Free Process</li>
                <li>Clean and hygienic packing</li>
              </ul>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={40} />
              </div>
              <h4>Trusted Brand</h4>
              <ul>
                <li>FSSAI certified products</li>
                <li>Years of customer satisfaction</li>
                <li>Premium quality assurance</li>
              </ul>
            </div>
          </div>
        </div>


        {/* Customer Reviews Section */}
        <div className="customer-reviews">
          <h2>Customer Reviews</h2>
          
          {/* Review Summary */}
          <div className="review-summary">
            <div className="review-stats">
              <div className="review-rating">
                <div className="stars-display">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < reviewStats.averageRating ? 'star filled' : 'star empty'}>★</span>
                  ))}
                </div>
                <span className="review-count">Based on {reviewStats.totalReviews} reviews</span>
              </div>
              
              <div className="rating-breakdown">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = reviewStats.ratingCounts[rating];
                  const maxCount = Math.max(...Object.values(reviewStats.ratingCounts));
                  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  
                  return (
                    <div key={rating} className="rating-bar">
                      <span className="rating-number">{rating}</span>
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < rating ? 'star filled' : 'star empty'}>★</span>
                        ))}
                      </div>
                      <div className="bar">
                        <div className="bar-fill" style={{width: `${percentage}%`}}></div>
                      </div>
                      <span className="count">({count})</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="review-actions">
              <button 
                className="write-review-btn"
                onClick={() => setShowWriteReview(true)}
              >
                Write A Review
              </button>
              <button 
                className="ask-question-btn"
                onClick={() => setShowAskQuestion(true)}
              >
                Ask A Question
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="review-tabs">
                <button
                  className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews ({reviewStats.totalReviews})
                </button>
            <button 
              className={`tab ${activeTab === 'questions' ? 'active' : ''}`}
              onClick={() => setActiveTab('questions')}
            >
              Questions (0)
            </button>
            
                {activeTab === 'reviews' && (
                  <div className="sort-container">
                    <button
                      className="sort-btn"
                      onClick={() => setShowSortDropdown(!showSortDropdown)}
                    >
                      {sortBy} ▼
                    </button>
                    {showSortDropdown && (
                      <div className="sort-dropdown">
                        <button onClick={() => handleSortChange('Most Recent')}>Most Recent</button>
                        <button onClick={() => handleSortChange('Highest Rating')}>Highest Rating</button>
                        <button onClick={() => handleSortChange('Lowest Rating')}>Lowest Rating</button>
                        <button onClick={() => handleSortChange('Only Pictures')}>Only Pictures</button>
                        <button onClick={() => handleSortChange('Pictures First')}>Pictures First</button>
                        <button onClick={() => handleSortChange('Picture first rating wise')}>Picture first rating wise</button>
                      </div>
                    )}
                  </div>
                )}
          </div>
          
              {/* Content */}
              <div className="review-content">
                {activeTab === 'reviews' ? (
                  sortedReviews.length > 0 ? (
                    <div className="reviews-grid">
                      {sortedReviews.map(review => (
                        <div key={review.id} className="review-card">
                          <div className="review-header">
                            <div className="reviewer-info">
                              {review.reviewImage && review.reviewImage.type && review.reviewImage.type.startsWith('image/') ? (
                                <img 
                                  src={URL.createObjectURL(review.reviewImage)} 
                                  alt="Review" 
                                  className="review-product-image" 
                                />
                              ) : (
                                <div className="review-product-placeholder">
                                  <span>📷</span>
                                </div>
                              )}
                              <div className="reviewer-details">
                                <h4>{review.name}</h4>
                                {review.title && <p className="review-title">{review.title}</p>}
                              </div>
                            </div>
                            <div className="rating">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < review.rating ? 'star filled' : 'star'}>★</span>
                              ))}
                            </div>
                          </div>
                          <p className="review-comment">{review.comment}</p>
                          {review.reviewImage && review.reviewImage.type && review.reviewImage.type.startsWith('video/') && (
                            <div className="review-image-container">
                              <video 
                                src={URL.createObjectURL(review.reviewImage)} 
                                controls 
                                className="review-attached-video"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-reviews">
                      <p>There are no reviews yet.</p>
                    </div>
                  )
                ) : (
                  <div className="questions-content">
                    <p>There are no questions yet.</p>
                  </div>
                )}
              </div>
        </div>
      </div>

      {/* Write Review Modal */}
      {showWriteReview && (
        <div className="modal-overlay" onClick={() => setShowWriteReview(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Write a review</h3>
              <button 
                className="close-btn"
                onClick={() => setShowWriteReview(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                  placeholder="Enter Your Name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={reviewForm.email}
                  onChange={(e) => setReviewForm({...reviewForm, email: e.target.value})}
                  placeholder="Enter Your Email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Rating *</label>
                <div className="rating-input">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`star ${i < reviewForm.rating ? 'filled' : 'empty'}`}
                      onClick={() => setReviewForm({...reviewForm, rating: i + 1})}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>Review Title</label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                  placeholder="Give your review a title"
                />
              </div>
              
              <div className="form-group">
                <label>Body of Review *</label>
                <textarea
                  value={reviewForm.body}
                  onChange={(e) => setReviewForm({...reviewForm, body: e.target.value})}
                  placeholder="Write your comments here"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Review Image/Video</label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    id="review-image"
                    accept="image/*,video/*"
                    onChange={handleReviewImageChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="review-image" className="browse-btn">
                    Browse
                  </label>
                  {reviewForm.reviewImage && (
                    <span className="file-name">{reviewForm.reviewImage.name}</span>
                  )}
                </div>
                {reviewForm.reviewImage && (
                  <div className="file-preview">
                    {reviewForm.reviewImage.type.startsWith('image/') ? (
                      <img 
                        src={getFilePreview(reviewForm.reviewImage)} 
                        alt="Preview" 
                        className="preview-image"
                      />
                    ) : reviewForm.reviewImage.type.startsWith('video/') ? (
                      <video 
                        src={getFilePreview(reviewForm.reviewImage)} 
                        controls 
                        className="preview-video"
                      />
                    ) : null}
                  </div>
                )}
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={reviewForm.recommend}
                    onChange={(e) => setReviewForm({...reviewForm, recommend: e.target.checked})}
                  />
                  Would you recommend this product?
                </label>
              </div>
              
              <button type="submit" className="submit-btn">Submit Review</button>
            </form>
          </div>
        </div>
      )}

      {/* Ask Question Modal */}
      {showAskQuestion && (
        <div className="modal-overlay" onClick={() => setShowAskQuestion(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Ask a Question</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAskQuestion(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleQuestionSubmit} className="question-form">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={questionForm.name}
                  onChange={(e) => setQuestionForm({...questionForm, name: e.target.value})}
                  placeholder="Enter Your Name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={questionForm.email}
                  onChange={(e) => setQuestionForm({...questionForm, email: e.target.value})}
                  placeholder="Enter Your Email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Question *</label>
                <textarea
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm({...questionForm, question: e.target.value})}
                  placeholder="Write your question here"
                  required
                />
              </div>
              
              <button type="submit" className="submit-btn">Submit Question</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ViewMoreDetails;

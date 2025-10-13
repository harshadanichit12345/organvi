import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import './Likeproduct.css';

const Likeproduct = () => {
  const [likedProducts, setLikedProducts] = useState([]);

  useEffect(() => {
    // Load liked products from localStorage
    const savedLikes = JSON.parse(localStorage.getItem('likedProducts')) || [];
    setLikedProducts(savedLikes);
  }, []);

  const removeFromLikes = (productId) => {
    const updatedLikes = likedProducts.filter(product => product.id !== productId);
    setLikedProducts(updatedLikes);
    localStorage.setItem('likedProducts', JSON.stringify(updatedLikes));
  };

  const addToCart = (product) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    alert('Product added to cart!');
  };

  return (
    <div className="like-page">
      <div className="like-container">
        <div className="like-header">
          <h1>Your Liked Products</h1>
          <p>{likedProducts.length} products in your wishlist</p>
        </div>

        {likedProducts.length === 0 ? (
          <div className="empty-likes">
            <Heart size={64} className="empty-heart" />
            <h2>No liked products yet</h2>
            <p>Start exploring and add products to your wishlist!</p>
            <Link to="/" className="browse-btn">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="liked-products-grid">
            {likedProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <button 
                    className="remove-like-btn"
                    onClick={() => removeFromLikes(product.id)}
                    title="Remove from wishlist"
                  >
                    <Heart size={20} className="filled-heart" />
                  </button>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={i < product.rating ? 'star-filled' : 'star-empty'} 
                        />
                      ))}
                    </div>
                    <span className="rating-text">({product.rating})</span>
                  </div>
                  <div className="product-price">
                    <span className="current-price">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="original-price">₹{product.originalPrice}</span>
                    )}
                  </div>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Likeproduct;

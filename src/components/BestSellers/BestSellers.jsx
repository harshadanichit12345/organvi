import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BestSellers.css';

const BestSellers = () => {
  const [cartItems, setCartItems] = useState([]);

  const bestSellerProducts = [
    {
      id: 1,
      name: 'Organic Almonds',
      price: 450,
      originalPrice: 500,
      image: '/src/assets/almond.png',
      discount: 10
    },
    {
      id: 2,
      name: 'Organic Cashew Nuts',
      price: 380,
      originalPrice: 420,
      image: '/src/assets/cashewnut.png',
      discount: 10
    },
    {
      id: 3,
      name: 'Organic Jaggery',
      price: 120,
      originalPrice: 150,
      image: '/src/assets/jeggary.png',
      discount: 20
    },
    {
      id: 4,
      name: 'Organic Turmeric',
      price: 180,
      originalPrice: 200,
      image: '/src/assets/termeric.png',
      discount: 10
    }
  ];

  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    
    // Show success message
    alert(`${product.name} added to cart!`);
  };

  return (
    <section className="best-sellers">
      <div className="best-sellers-container">
        <div className="best-sellers-content">
          <div className="best-sellers-main">
            <div className="best-sellers-header">
              <div className="best-sellers-header-content">
                <h2 className="best-sellers-title">Best Seller Products</h2>
                <Link to="/allcategories" className="view-more-link">
                  View More Products →
                </Link>
              </div>
            </div>
            
            
            <div className="best-sellers-scroll-container">
              <div className="best-sellers-grid">
                {bestSellerProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="discount-badge">
                      Save {product.discount}%
                    </div>
                    
                    <div className="product-image-container">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="product-image"
                      />
                    </div>
                    
                    <div className="product-details">
                      <h3 className="product-name">{product.name}</h3>
                      
                      <div className="product-pricing">
                        <span className="current-price">₹{product.price}</span>
                        <span className="original-price">₹{product.originalPrice}</span>
                      </div>
                      
                      <div className="product-actions">
                        <button 
                          className="add-to-cart-btn"
                          onClick={() => addToCart(product)}
                        >
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;

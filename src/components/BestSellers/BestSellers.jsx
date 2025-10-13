import React, { useState } from 'react';
import './BestSellers.css';

const BestSellers = () => {
  const [cartItems, setCartItems] = useState([]);

  const bestSellerProducts = [
    {
      id: 1,
      name: 'Organic Quinoa Flour',
      price: 285,
      originalPrice: 300,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop',
      discount: 5
    },
    {
      id: 2,
      name: 'Organic Turmeric Powder',
      price: 180,
      originalPrice: 200,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop',
      discount: 10
    },
    {
      id: 3,
      name: 'Organic Almonds',
      price: 450,
      originalPrice: 500,
      image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&h=300&fit=crop',
      discount: 10
    },
    {
      id: 4,
      name: 'Organic Jaggery',
      price: 120,
      originalPrice: 150,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop',
      discount: 20
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
              <h2 className="best-sellers-title">Best Seller Products</h2>
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

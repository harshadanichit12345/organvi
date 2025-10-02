import React, { useState, useEffect } from 'react';
// import Filter from '../Filter/Filter';
import './Spices.css';

// Import product images for spices
import chillyImg from '../../assets/chilly.jpg';
import chilly1Img from '../../assets/chilly1.jpg';
import chilly2Img from '../../assets/chilly2.png';
import termericImg from '../../assets/termeric.png';
import termeric2Img from '../../assets/termeric2.jpg';
import termeric3Img from '../../assets/termeric3.jpg';
import termeric4Img from '../../assets/termeric4.jpg';
import termeric5Img from '../../assets/termeric5.png';

// Spices Icon
const SpicesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const Spices = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [quantityDisplay, setQuantityDisplay] = useState({});
  const [selectedWeights, setSelectedWeights] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    sortBy: 'name',
    availability: 'all',
    organicOnly: false,
    selectedCategory: 'spices',
    selectedItems: [],
    selectedPackageTypes: []
  });

  // Spices products data - Each product is unique with distinct names and images
  const spicesProducts = [
    { 
      id: 1,
      name: 'Organic Red Chilli Powder', 
      price: 85, 
      originalPrice: 95,
      discount: 11,
      weight: '100g',
      image: chillyImg,
      inStock: true, 
      organic: true 
    },
    { 
      id: 2,
      name: 'Premium Green Chillies', 
      price: 45, 
      originalPrice: 50,
      discount: 10,
      weight: '250g',
      image: chilly1Img,
      inStock: true, 
      organic: true 
    },
    { 
      id: 3,
      name: 'Dried Red Chillies', 
      price: 120, 
      originalPrice: 135,
      discount: 11,
      weight: '200g',
      image: chilly2Img,
      inStock: true, 
      organic: true 
    },
    { 
      id: 4,
      name: 'Organic Turmeric Powder', 
      price: 75, 
      originalPrice: 85,
      discount: 12,
      weight: '100g',
      image: termericImg,
      inStock: true, 
      organic: true 
    },
    { 
      id: 5,
      name: 'Fresh Turmeric Root', 
      price: 60, 
      originalPrice: 70,
      discount: 14,
      weight: '250g',
      image: termeric2Img,
      inStock: true, 
      organic: true 
    },
    { 
      id: 6,
      name: 'Ground Turmeric', 
      price: 90, 
      originalPrice: 100,
      discount: 10,
      weight: '150g',
      image: termeric3Img,
      inStock: true, 
      organic: true 
    },
    { 
      id: 7,
      name: 'Turmeric Powder Premium', 
      price: 110, 
      originalPrice: 125,
      discount: 12,
      weight: '200g',
      image: termeric4Img,
      inStock: true, 
      organic: true 
    },
    { 
      id: 8,
      name: 'Organic Turmeric Whole', 
      price: 95, 
      originalPrice: 110,
      discount: 14,
      weight: '100g',
      image: termeric5Img,
      inStock: true, 
      organic: true 
    }
  ];

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Cart functionality
  const addToCart = (product, weight) => {
    const cartKey = `${product.id}-${weight}`;
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.cartKey === cartKey);
      if (existingItem) {
        return prevCart.map(item =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const weightOption = weightOptions.find(w => w.value === weight);
        const price = Math.round(product.price * weightOption.multiplier);
        const originalPrice = Math.round(product.originalPrice * weightOption.multiplier);
        return [...prevCart, { 
          ...product, 
          quantity: 1, 
          cartKey,
          weight,
          price,
          originalPrice
        }];
      }
    });
  };

  const addToCartPage = (product, weight) => {
    // Check if quantity is 0 - don't add to cart if count is 0
    const cartKey = `${product.id}-${weight}`;
    const cartQuantity = quantityDisplay[cartKey] || 0;
    if (cartQuantity === 0) {
      alert("Please increase the quantity first using + button!");
      return;
    }
    
    const weightOption = weightOptions.find(w => w.value === weight);
    const price = Math.round(product.price * weightOption.multiplier);
    const originalPrice = Math.round(product.originalPrice * weightOption.multiplier);
    
    // Create cart item for localStorage with the current quantity
    const cartItem = {
      id: `${product.id}-${weight}`,
      name: product.name,
      price: price,
      originalPrice: originalPrice,
      image: product.image,
      weight: weight,
      quantity: cartQuantity
    };
    
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists
    const existingItemIndex = existingCart.findIndex(item => item.id === cartItem.id);
    
    if (existingItemIndex === -1) {
      // Add new item to cart
      const updatedCart = [...existingCart, cartItem];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      // Update existing item quantity
      const updatedCart = existingCart.map(item =>
        item.id === cartItem.id
          ? { ...item, quantity: item.quantity + cartQuantity }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
    
    // Update cart count in navbar/sidebar
    setTimeout(() => {
      const finalCart = JSON.parse(localStorage.getItem('cart')) || [];
      const uniqueItems = finalCart.length; // Count unique products, not quantities
      console.log('Cart updated - Unique items:', uniqueItems, 'Cart:', finalCart);
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: uniqueItems }));
      // Also trigger storage event for cross-tab compatibility
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'cart',
        newValue: JSON.stringify(finalCart)
      }));
    }, 100);
    
    // Show success popup notification
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const removeFromCart = (cartKey) => {
    setCart(prevCart => prevCart.filter(item => item.cartKey !== cartKey));
  };

  const updateQuantity = (cartKey, newQuantity) => {
    console.log('updateQuantity called:', cartKey, newQuantity);
    if (newQuantity <= 0) {
      setQuantityDisplay(prev => {
        const newState = { ...prev };
        delete newState[cartKey];
        return newState;
      });
    } else {
      setQuantityDisplay(prev => ({
        ...prev,
        [cartKey]: newQuantity
      }));
    }
  };

  const getCartItemQuantity = (productId, weight) => {
    const cartKey = `${productId}-${weight}`;
    return quantityDisplay[cartKey] || 0;
  };

  // Weight options and pricing
  const weightOptions = [
    { value: '100g', label: '100g', multiplier: 1 },
    { value: '250g', label: '250g', multiplier: 2.5 },
    { value: '500g', label: '500g', multiplier: 5 }
  ];

  const getSelectedWeight = (productId) => {
    return selectedWeights[productId] || '100g';
  };

  const handleWeightChange = (productId, weight) => {
    setSelectedWeights(prev => ({
      ...prev,
      [productId]: weight
    }));
  };

  const getProductPrice = (product, weight) => {
    const weightOption = weightOptions.find(w => w.value === weight);
    return Math.round(product.price * weightOption.multiplier);
  };

  const getProductOriginalPrice = (product, weight) => {
    const weightOption = weightOptions.find(w => w.value === weight);
    return Math.round(product.originalPrice * weightOption.multiplier);
  };

  const applyFilters = (products, filterSettings) => {
    let filtered = [...products];

    // Filter by selected items (subcategories)
    if (filterSettings.selectedItems && filterSettings.selectedItems.length > 0) {
      const selectedProductNames = filterSettings.selectedItems.flatMap(item => item.products);
      filtered = filtered.filter(product => 
        selectedProductNames.some(selectedName => 
          product.name.toLowerCase().includes(selectedName.toLowerCase())
        )
      );
    }

    // Filter by package types
    if (filterSettings.selectedPackageTypes && filterSettings.selectedPackageTypes.length > 0) {
      filtered = filtered.filter(product => 
        filterSettings.selectedPackageTypes.some(packageType => 
          product.name.toLowerCase().includes(packageType.toLowerCase())
        )
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= filterSettings.priceRange[0] && 
      product.price <= filterSettings.priceRange[1]
    );

    // Filter by availability
    if (filterSettings.availability === 'in-stock') {
      filtered = filtered.filter(product => product.inStock);
    } else if (filterSettings.availability === 'out-of-stock') {
      filtered = filtered.filter(product => !product.inStock);
    }

    // Filter by organic only
    if (filterSettings.organicOnly) {
      filtered = filtered.filter(product => product.organic);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (filterSettings.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'popularity':
          return Math.random() - 0.5; // Random for demo
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredProductsList = applyFilters(spicesProducts, filters);

  useEffect(() => {
    setFilteredProducts(applyFilters(spicesProducts, filters));
  }, [filters]);

  return (
    <div className="spices-page">
      <div className="spices-container">
        <div className="spices-content">
          <div className="spices-sidebar">
            {/* <Filter 
              onFilterChange={handleFilterChange}
              categories={[{ id: 'spices', name: 'Spices & Masalas', products: spicesProducts }]}
              selectedCategory="spices"
            /> */}
          </div>
          
          <div className="spices-main">
            <div className="spices-header">
              <h1 className="spices-title">Spices & Masalas</h1>
              <p className="spices-subtitle">Discover our premium collection of organic spices and masalas</p>
            </div>
            
            <div className="spices-info">
              <p className="spices-count">
                {filters.selectedItems && filters.selectedItems.length > 0 ? (
                  `Showing ${filteredProductsList.length} products from selected categories`
                ) : filters.selectedPackageTypes && filters.selectedPackageTypes.length > 0 ? (
                  `Showing ${filteredProductsList.length} products from selected package types`
                ) : (
                  `Showing ${filteredProductsList.length} of ${spicesProducts.length} products`
                )}
              </p>
              
              {/* Cart Summary */}
              {cart.length > 0 && (
                <div className="cart-summary">
                  <h3>Cart ({cart.reduce((total, item) => total + item.quantity, 0)} items)</h3>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <span className="cart-item-name">{item.name}</span>
                        <span className="cart-item-quantity">Qty: {item.quantity}</span>
                        <span className="cart-item-price">₹{item.price * item.quantity}</span>
                        <button 
                          className="remove-from-cart-btn"
                          onClick={() => removeFromCart(item.id)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="cart-total">
                    Total: ₹{cart.reduce((total, item) => total + (item.price * item.quantity), 0)}
                  </div>
                </div>
              )}
            </div>
            
            <div className="spices-scroll-container">
              <div className="spices-grid">
                {filteredProductsList.map((product, index) => {
                  const selectedWeight = getSelectedWeight(product.id);
                  const cartQuantity = getCartItemQuantity(product.id, selectedWeight);
                  const currentPrice = getProductPrice(product, selectedWeight);
                  const currentOriginalPrice = getProductOriginalPrice(product, selectedWeight);
                  const cartKey = `${product.id}-${selectedWeight}`;
                  
                  return (
                    <div key={product.id} className="product-card">
                      {/* Discount Badge */}
                      <div className="discount-badge">
                        -{product.discount}%
                      </div>
                      
                      {/* Heart Icon */}
                      <div className="heart-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                      </div>

                      {/* Product Image */}
                      <div className="product-image-container">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="product-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="product-image-placeholder" style={{display: 'none'}}>
                          <span className="product-emoji">🌶️</span>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="product-details">
                        <h3 className="product-name">{product.name}</h3>
                        
                        <div className="product-pricing">
                          <span className="current-price">
                            ₹{cartQuantity > 0 ? currentPrice * cartQuantity : currentPrice}
                          </span>
                          <span className="original-price">
                            ₹{cartQuantity > 0 ? currentOriginalPrice * cartQuantity : currentOriginalPrice}
                          </span>
                        </div>
                        
                        {/* Weight Dropdown */}
                        <div className="weight-selector">
                          <select 
                            className="weight-dropdown"
                            value={selectedWeight}
                            onChange={(e) => handleWeightChange(product.id, e.target.value)}
                          >
                            {weightOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="product-actions">
                          <div className="quantity-controls">
                            <button 
                              className="quantity-btn minus"
                              onClick={() => {
                                console.log('Minus button clicked:', cartKey, cartQuantity - 1);
                                updateQuantity(cartKey, cartQuantity - 1);
                              }}
                              disabled={cartQuantity <= 0}
                            >
                              -
                            </button>
                            <span className="quantity-display">{cartQuantity}</span>
                            <button 
                              className="quantity-btn plus"
                              onClick={() => {
                                console.log('Plus button clicked:', cartKey, cartQuantity + 1);
                                updateQuantity(cartKey, cartQuantity + 1);
                              }}
                            >
                              +
                            </button>
                          </div>
                          <button 
                            className="add-btn"
                            onClick={() => addToCartPage(product, selectedWeight)}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {filteredProductsList.length === 0 && (
              <div className="no-products">
                <p>No spice products found matching your filters.</p>
                <button 
                  className="clear-filters-btn"
                  onClick={() => handleFilterChange({
                    priceRange: [0, 1000],
                    sortBy: 'name',
                    availability: 'all',
                    organicOnly: false,
                    selectedCategory: 'spices',
                    selectedItems: [],
                    selectedPackageTypes: []
                  })}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Success Notification Popup */}
      {showNotification && (
        <div className="success-notification">
          <div className="notification-content">
            <span className="notification-icon">✅</span>
            <span className="notification-text">Item added to cart successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Spices;

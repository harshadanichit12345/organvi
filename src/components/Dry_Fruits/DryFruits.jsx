import React, { useState, useEffect } from 'react';
// import Filter from '../Filter/Filter';
import './DryFruits.css';

// Import product images for dry fruits and nuts
import almondImg from '../../assets/almond.png';
import cashewnutImg from '../../assets/cashewnut.png';
import pistaImg from '../../assets/pista1.png';
import raisinImg from '../../assets/rainse1.png';

// Dry Fruits Icon
const DryFruitsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const DryFruits = () => {
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
    selectedCategory: 'dryfruits',
    selectedItems: [],
    selectedPackageTypes: []
  });

  // Dry Fruits and Nuts products data - Each product is unique with distinct names and images
  const dryFruitsProducts = [
    { 
      id: 1,
      name: 'Organic California Almonds', 
      price: 450, 
      originalPrice: 500,
      discount: 10,
      weight: '250g',
      image: almondImg,
      inStock: true, 
      organic: true 
    },
    { 
      id: 2,
      name: 'Premium Kaju Cashews', 
      price: 500, 
      originalPrice: 550,
      discount: 9,
      weight: '250g',
      image: cashewnutImg,
      inStock: true, 
      organic: true 
    },
    { 
      id: 3,
      name: 'Iranian Pistachios', 
      price: 600, 
      originalPrice: 650,
      discount: 8,
      weight: '250g',
      image: pistaImg,
      inStock: true, 
      organic: true 
    },
    { 
      id: 4,
      name: 'Black Kishmish Raisins', 
      price: 200, 
      originalPrice: 220,
      discount: 9,
      weight: '500g',
      image: raisinImg,
      inStock: true, 
      organic: true 
    },
    { 
      id: 5,
      name: 'Blanched Almonds', 
      price: 550, 
      originalPrice: 600,
      discount: 8,
      weight: '500g',
      image: almondImg,
      inStock: true, 
      organic: true 
    },
    { 
      id: 6,
      name: 'Raw Cashew Nuts', 
      price: 600, 
      originalPrice: 650,
      discount: 8,
      weight: '500g',
      image: cashewnutImg,
      inStock: true, 
      organic: true 
    },
    { 
      id: 7,
      name: 'Roasted Pistachios', 
      price: 750, 
      originalPrice: 800,
      discount: 6,
      weight: '500g',
      image: pistaImg,
      inStock: true, 
      organic: true 
    },
    { 
      id: 8,
      name: 'Golden Raisins', 
      price: 250, 
      originalPrice: 280,
      discount: 11,
      weight: '1kg',
      image: raisinImg,
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
    { value: '1kg', label: '1 kg', multiplier: 1 },
    { value: '2kg', label: '2 kg', multiplier: 2 },
    { value: '5kg', label: '5 kg', multiplier: 5 }
  ];

  const getSelectedWeight = (productId) => {
    return selectedWeights[productId] || '1kg';
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

  const filteredProductsList = applyFilters(dryFruitsProducts, filters);

  useEffect(() => {
    setFilteredProducts(applyFilters(dryFruitsProducts, filters));
  }, [filters]);

  return (
    <div className="dryfruits-page">
      <div className="dryfruits-container">
        <div className="dryfruits-content">
          <div className="dryfruits-sidebar">
            {/* <Filter 
              onFilterChange={handleFilterChange}
              categories={[{ id: 'dryfruits', name: 'Dry Fruits & Nuts', products: dryFruitsProducts }]}
              selectedCategory="dryfruits"
            /> */}
          </div>
          
          <div className="dryfruits-main">
            <div className="dryfruits-header">
              <h1 className="dryfruits-title">Dry Fruits & Nuts</h1>
              <p className="dryfruits-subtitle">Discover our premium collection of organic dry fruits and nuts</p>
            </div>
            
            <div className="dryfruits-info">
              <p className="dryfruits-count">
                {filters.selectedItems && filters.selectedItems.length > 0 ? (
                  `Showing ${filteredProductsList.length} products from selected categories`
                ) : filters.selectedPackageTypes && filters.selectedPackageTypes.length > 0 ? (
                  `Showing ${filteredProductsList.length} products from selected package types`
                ) : (
                  `Showing ${filteredProductsList.length} of ${dryFruitsProducts.length} products`
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
            
            <div className="dryfruits-scroll-container">
              <div className="dryfruits-grid">
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
                          <span className="product-emoji">🥜</span>
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
                <p>No dry fruits products found matching your filters.</p>
                <button 
                  className="clear-filters-btn"
                  onClick={() => handleFilterChange({
                    priceRange: [0, 1000],
                    sortBy: 'name',
                    availability: 'all',
                    organicOnly: false,
                    selectedCategory: 'dryfruits',
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

export default DryFruits;

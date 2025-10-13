import React, { useState, useEffect } from 'react';
import './Spices.css';
import { client } from '../../client';
import { allSpicesQuery } from '../../groqQueries';

// Your existing imports for images can stay if you want fallback images
// import chillyImg from '../../assets/chilly.jpg'; // optional fallback

const Spices = () => {
  const [spicesProducts, setSpicesProducts] = useState([]); // Will hold Sanity data
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
    selectedItems: [],
    selectedPackageTypes: []
  });

  // Weight options
  const weightOptions = [
    { value: '100g', label: '100g', multiplier: 1 },
    { value: '250g', label: '250g', multiplier: 2.5 },
    { value: '500g', label: '500g', multiplier: 5 }
  ];

  // 1️⃣ Fetch spices from Sanity
  useEffect(() => {
    client.fetch(allSpicesQuery)
      .then(data => {
        const formattedData = data.map(item => ({
          id: item._id,
          name: item.title,
          description: item.description || '',
          price: item.price || 0,
          originalPrice: item.price || 0,
          discount: 0,
          weight: '100g',
          image: item.imageUrl || '', // fallback if no image
          inStock: true,
          organic: true
        }));
        setSpicesProducts(formattedData);
      })
      .catch(err => console.error('Sanity fetch error:', err));
  }, []);

  // 2️⃣ Apply filters
  const applyFilters = (products, filterSettings) => {
    let filtered = [...products];

    // Price filter
    filtered = filtered.filter(p => p.price >= filterSettings.priceRange[0] && p.price <= filterSettings.priceRange[1]);

    // Availability filter
    if (filterSettings.availability === 'in-stock') filtered = filtered.filter(p => p.inStock);
    if (filterSettings.availability === 'out-of-stock') filtered = filtered.filter(p => !p.inStock);

    // Organic filter
    if (filterSettings.organicOnly) filtered = filtered.filter(p => p.organic);

    // Sorting
    filtered.sort((a, b) => {
      switch (filterSettings.sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'price': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        default: return 0;
      }
    });

    return filtered;
  };

  useEffect(() => {
    // Use Sanity data if loaded, else fallback to empty array
    setFilteredProducts(applyFilters(spicesProducts, filters));
  }, [spicesProducts, filters]);

  // 3️⃣ Cart helpers
  const getSelectedWeight = (productId) => selectedWeights[productId] || '100g';
  const getCartItemQuantity = (productId, weight) => {
    const cartKey = `${productId}-${weight}`;
    return quantityDisplay[cartKey] || 0;
  };
  const handleWeightChange = (productId, weight) => {
    setSelectedWeights(prev => ({ ...prev, [productId]: weight }));
  };
  const getProductPrice = (product, weight) => {
    const option = weightOptions.find(w => w.value === weight);
    return Math.round(product.price * option.multiplier);
  };
  const getProductOriginalPrice = (product, weight) => {
    const option = weightOptions.find(w => w.value === weight);
    return Math.round(product.originalPrice * option.multiplier);
  };
  const updateQuantity = (cartKey, newQuantity) => {
    if (newQuantity <= 0) {
      setQuantityDisplay(prev => {
        const newState = { ...prev };
        delete newState[cartKey];
        return newState;
      });
    } else {
      setQuantityDisplay(prev => ({ ...prev, [cartKey]: newQuantity }));
    }
  };
  const addToCartPage = (product, weight) => {
    const cartKey = `${product.id}-${weight}`;
    const cartQuantity = quantityDisplay[cartKey] || 0;
    if (cartQuantity === 0) {
      alert("Please increase the quantity first using + button!");
      return;
    }
    const weightOption = weightOptions.find(w => w.value === weight);
    const price = Math.round(product.price * weightOption.multiplier);
    const originalPrice = Math.round(product.originalPrice * weightOption.multiplier);

    const cartItem = {
      id: cartKey,
      name: product.name,
      price,
      originalPrice,
      image: product.image,
      weight,
      quantity: cartQuantity
    };

    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = existingCart.findIndex(item => item.id === cartItem.id);

    let updatedCart = [];
    if (existingIndex === -1) updatedCart = [...existingCart, cartItem];
    else {
      updatedCart = existingCart.map(item => 
        item.id === cartItem.id ? { ...item, quantity: item.quantity + cartQuantity } : item
      );
    }
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
    setQuantityDisplay(prev => ({ ...prev, [cartKey]: 0 }));
  };

  // 4️⃣ Loading state
  if (!spicesProducts.length) return <p className="text-center mt-6">Loading spices...</p>;

  // 5️⃣ Render
  return (
    <div className="spices-page">
      <h1 className="spices-title">Spices & Masalas</h1>
      <p className="spices-subtitle">Discover our premium collection of organic spices</p>

      <div className="spices-grid">
        {filteredProducts.map(product => {
          const selectedWeight = getSelectedWeight(product.id);
          const cartQuantity = getCartItemQuantity(product.id, selectedWeight);
          const currentPrice = getProductPrice(product, selectedWeight);
          const currentOriginalPrice = getProductOriginalPrice(product, selectedWeight);
          const cartKey = `${product.id}-${selectedWeight}`;

          
          return (
            <div key={product.id} className="product-card">
              {product.image && <img src={product.image} alt={product.name} className="product-image" />}
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="product-pricing">
                <span className="current-price">₹{cartQuantity > 0 ? currentPrice * cartQuantity : currentPrice}</span>
                <span className="original-price">₹{cartQuantity > 0 ? currentOriginalPrice * cartQuantity : currentOriginalPrice}</span>
              </div>
              <select value={selectedWeight} onChange={e => handleWeightChange(product.id, e.target.value)}>
                {weightOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(cartKey, cartQuantity - 1)} disabled={cartQuantity <= 0}>-</button>
                <span>{cartQuantity}</span>
                <button onClick={() => updateQuantity(cartKey, cartQuantity + 1)}>+</button>
              </div>
              <button onClick={() => addToCartPage(product, selectedWeight)}>Add</button>
            </div>
          );
        })}
      </div>

      {showNotification && (
        <div className="success-notification">
          <span>✅ Item added to cart successfully!</span>
        </div>
      )}
    </div>
  );
};

export default Spices;

import React, { useState } from 'react';
import './Categories.css';

// Grid-style icons for all categories
const AllCategoriesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const PulsesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const DryFruitsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const SweetenersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const SpicesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProducts, setShowProducts] = useState(false);

  const categories = [
    {
      id: 'all',
      name: 'All Categories',
      icon: AllCategoriesIcon,
      products: [
        'Organic Turmeric', 'Organic Jaggery', 'Organic Chana Dal', 'Organic Moong Dal',
        'Organic Toor Dal', 'Organic Urad Dal', 'Organic Almonds', 'Organic Cashews',
        'Organic Pistachios', 'Organic Raisins', 'Organic Roasted Chana', 'Organic Chilly Powder'
      ]
    },
    {
      id: 'pulses',
      name: 'Pulses & Grains',
      icon: PulsesIcon,
      products: [
        'Organic Chana Dal', 'Organic Moong Dal', 'Organic Toor Dal', 'Organic Urad Dal',
        'Organic Basmati Rice', 'Organic Brown Rice', 'Organic Quinoa', 'Organic Barley'
      ]
    },
    {
      id: 'dryfruits',
      name: 'Dry Fruits & Nuts',
      icon: DryFruitsIcon,
      products: [
        'Organic Almonds', 'Organic Cashews', 'Organic Pistachios', 'Organic Raisins',
        'Organic Walnuts', 'Organic Dates', 'Organic Figs', 'Organic Apricots'
      ]
    },
    {
      id: 'sweeteners',
      name: 'Sweeteners',
      icon: SweetenersIcon,
      products: [
        'Organic Jaggery', 'Organic Honey', 'Organic Maple Syrup', 'Organic Coconut Sugar',
        'Organic Stevia', 'Organic Date Syrup', 'Organic Agave Nectar'
      ]
    },
    {
      id: 'spices',
      name: 'Spices & Powders',
      icon: SpicesIcon,
      products: [
        'Organic Turmeric', 'Organic Chilly Powder', 'Organic Coriander Powder', 'Organic Cumin Powder',
        'Organic Garam Masala', 'Organic Red Chili Flakes', 'Organic Black Pepper', 'Organic Cardamom'
      ]
    }
  ];

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowProducts(true);
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="categories-page">
      <div className="categories-container">
        <div className="categories-header">
          <h1 className="categories-title">All Categories</h1>
          <p className="categories-subtitle">Browse our complete range of organic products</p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className={`category-box ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="category-icon">
                  <IconComponent className="icon-component" />
                </div>
                <div className="category-content">
                  <h3 className="category-name">{category.name}</h3>
                </div>
              </div>
            );
          })}
        </div>

        {showProducts && selectedCategoryData && (
          <div className="products-section">
            <div className="products-header">
              <h3 className="products-title">{selectedCategoryData.name}</h3>
              <button 
                className="close-products"
                onClick={() => setShowProducts(false)}
              >
                ✕
              </button>
            </div>
            <div className="products-grid">
              {selectedCategoryData.products.map((product, index) => (
                <div key={index} className="product-item">
                  <div className="product-icon">
                    <span className="product-emoji">
                      {selectedCategory === 'all' ? '🌱' : 
                       selectedCategory === 'pulses' ? '🌾' :
                       selectedCategory === 'dryfruits' ? '🥜' :
                       selectedCategory === 'sweeteners' ? '🍯' : '🌶️'}
                    </span>
                  </div>
                  <span className="product-name">{product}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
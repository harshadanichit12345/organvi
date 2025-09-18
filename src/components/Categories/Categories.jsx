import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Categories.css';

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    if (categoryId === 1) {
      // Navigate to AllCategories page when "All Products" is clicked
      navigate('/allcategories');
    } else {
      // For other categories, you can add navigation to specific category pages
      console.log(`Navigate to category: ${categoryId}`);
    }
  };

  const categories = [
    {
      id: 1,
      name: 'All Products',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
          <path d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4"/>
          <path d="M12 3v4"/>
          <path d="M8 3v4"/>
          <path d="M16 3v4"/>
        </svg>
      )
    },
    {
      id: 2,
      name: 'Pulses & Dal',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 12h8"/>
          <path d="M12 8v8"/>
        </svg>
      )
    },
    {
      id: 3,
      name: 'Dry Fruits & Nuts',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      )
    },
    {
      id: 4,
      name: 'Sweeteners',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12l2 2 4-4"/>
          <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
          <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
          <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/>
          <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"/>
        </svg>
      )
    },
    {
      id: 5,
      name: 'Spices & Masalas',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
          <circle cx="12" cy="12" r="1"/>
        </svg>
      )
    }
  ];

  return (
    <div className="categories-container">
      <div className="categories-row">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="category-item"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="category-icon">
              {category.icon}
            </div>
            <div className="category-name">
              {category.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Categories.css';

// Import category images
import allProductIcon from '../../assets/allproduct.png';
import pulsesIcon from '../../assets/pulses.png';
import dryFruitsIcon from '../../assets/dryfruits.png';
import sweetenerIcon from '../../assets/sweetner.png';
import spicesIcon from '../../assets/spices.png';

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    if (categoryId === 1) {
      // Navigate to Pulses page when "Pulses & Dal" is clicked
      navigate('/pulses');
    } else if (categoryId === 2) {
      // Navigate to Sweetener page when "Sweetener" is clicked
      navigate('/sweetener');
    } else if (categoryId === 3) {
      // Navigate to DryFruits page when "Dry Fruits & Nuts" is clicked
      navigate('/dryfruits');
    } else if (categoryId === 4) {
      // Navigate to Spices page when "Spices & Masalas" is clicked
      navigate('/spices');
    } else {
      // For other categories, you can add navigation to specific category pages
      console.log(`Navigate to category: ${categoryId}`);
    }
  };

  const categories = [
    {
      id: 1,
      name: 'Pulses & Dal',
      icon: <img src={pulsesIcon} alt="Pulses & Dal" className="category-image" />
    },
    {
      id: 2,
      name: 'Sweetener',
      icon: <img src={sweetenerIcon} alt="Sweetener" className="category-image" />
    },
    {
      id: 3,
      name: 'Dry Fruits & Nuts',
      icon: <img src={dryFruitsIcon} alt="Dry Fruits & Nuts" className="category-image" />
    },
    {
      id: 4,
      name: 'Spices & Masalas',
      icon: <img src={spicesIcon} alt="Spices & Masalas" className="category-image" />
    },
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


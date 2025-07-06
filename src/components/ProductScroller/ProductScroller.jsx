// ProductScroller.jsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Minus, ShoppingCart } from 'lucide-react';
import './ProductScroller.css';

import roastedChana from '../../assets/roastchana1.png';
import Raisins from '../../assets/rainse1.png';
import UradDal from '../../assets/uraldal.png';
import Pista from '../../assets/pista1.png';
import CashewNuts from '../../assets/cashewnut.png';
import Almonds from '../../assets/almond.png';
import Jaggery from '../../assets/jeggary.png';
import TurmericPowder from '../../assets/termeric.png';
import ToorDal from '../../assets/toordal.png';
import MirchiPowder from '../../assets/chilly2.png';
import MoongDal from '../../assets/moongdal.png';
import ChanaDal from '../../assets/chanadal.png';

const ProductScroller = ({ searchTerm }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quantities, setQuantities] = useState({});
  const [popupMessage, setPopupMessage] = useState('');

  const products = [
    { id: 1, name: 'Roasted Chana', description: 'Premium quality roasted chickpeas, perfect for snacking', price: 160, image: roastedChana, category: 'pulse' },
    { id: 2, name: 'Raisins', description: 'Sweet and chewy organic raisins from premium grapes', price: 200, image: Raisins, category: 'Nuts' },
    { id: 3, name: 'Premium Urad Dal', description: 'High-protein black gram dal, perfect for traditional dishes', price: 180, image: UradDal, category: 'pulse' },
    { id: 4, name: 'Organic Pistachios', description: 'Premium quality pistachios, rich in nutrients', price: 450, image: Pista, category: 'Nuts' },
    { id: 5, name: 'Cashew Nuts', description: 'Creamy and delicious organic cashews', price: 420, image: CashewNuts, category: 'Nuts' },
    { id: 6, name: 'Raw Almonds', description: 'Fresh organic almonds, perfect for healthy snacking', price: 390, image: Almonds, category: 'Nuts' },
    { id: 7, name: 'Jaggery', description: 'Sweet, natural jaggery', price: 140, image: Jaggery, category: 'Sweeteners' },
    { id: 8, name: 'Turmeric Powder', description: 'Organic turmeric powder for cooking and health', price: 100, image: TurmericPowder, category: 'Spices' },
    { id: 9, name: 'Toor Dal', description: 'Protein-rich toor dal', price: 220, image: ToorDal, category: 'pulse' },
    { id: 10, name: 'Mirchi Powder', description: 'Spicy and bold red chili powder', price: 100, image: MirchiPowder, category: 'Spices' },
    { id: 11, name: 'Moong Dal', description: 'Light and digestible moong dal', price: 180, image: MoongDal, category: 'pulse' },
    { id: 12, name: 'Chana Dal', description: 'Rich in protein chana dal', price: 140, image: ChanaDal, category: 'pulse' }
  ];

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const itemsPerView = 3;
  const maxIndex = Math.max(0, filteredProducts.length - itemsPerView);

  const nextSlide = () => setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  const prevSlide = () => setCurrentIndex(prev => Math.max(prev - 1, 0));

  const updateQuantity = (productId, change) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change)
    }));
  };

  const addToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

    const updatedCart = (() => {
      const found = existingCart.find(item => item.id === product.id);
      if (found) {
        return existingCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...existingCart, { ...product, quantity }];
      }
    })();

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));

    setPopupMessage(`${quantity} x ${product.name} added to cart`);
    setTimeout(() => setPopupMessage(''), 2000);
  };

  return (
    <section className="product-scroller">
      <div className="container">
        {popupMessage && <div className="cart-popup-message">{popupMessage}</div>}

        <div className="scroller-header">
          <h2 className="scroller-title">Featured Products</h2>
          <p className="scroller-description">
            Discover our handpicked selection of premium organic pantry staples
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="no-results">No products found for "{searchTerm}"</p>
        ) : (
          <div className="scroller-container">
            {currentIndex > 0 && (
              <button className="scroller-button left" onClick={prevSlide}>
                <ChevronLeft size={24} />
              </button>
            )}

            <div className="products-wrapper">
              <div
                className="products-container"
                style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
              >
                {filteredProducts.map((product, index) => (
                  <div key={product.id} className="product-card" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="product-image-container">
                      <img src={product.image} alt={product.name} className="product-image" />
                      <div className="product-badge">{product.category}</div>
                    </div>

                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description}</p>

                      <div className="product-actions">
                        <span className="price small">₹{product.price}</span>

                        <div className="quantity-selector compact">
                          <button className="quantity-btn small" onClick={() => updateQuantity(product.id, -1)}>
                            <Minus size={14} />
                          </button>
                          <span className="quantity small">{quantities[product.id] || 1}</span>
                          <button className="quantity-btn small" onClick={() => updateQuantity(product.id, 1)}>
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                        <ShoppingCart size={18} /> Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {currentIndex < maxIndex && (
              <button className="scroller-button right" onClick={nextSlide}>
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="scroller-indicators">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductScroller;

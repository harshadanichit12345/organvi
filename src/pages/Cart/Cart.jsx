import React, { useEffect, useState } from 'react';
import './Cart.css';

const Carts = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const updateCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const increaseQty = (id) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedItems);
  };

  const decreaseQty = (id) => {
    const updatedItems = cartItems
      .map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      );
    updateCart(updatedItems);
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h4>{item.name}</h4>
                <p>Price: ₹{item.price}</p>
                <div className="quantity-controls">
                  <button onClick={() => decreaseQty(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item.id)}>+</button>
                </div>
                <p>Total: ₹{item.quantity * item.price}</p>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <h3>Total Amount: ₹{getTotal()}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carts;
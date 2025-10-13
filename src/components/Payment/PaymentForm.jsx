import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentForm.css';
import upiIcon from '../../assets/upi (1).png';
import cardIcon from '../../assets/mastercard.png';

const PaymentForm = ({ cartItems, totalAmount, onPaymentSuccess, onPaymentFailure }) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Address + Summary, 2: Payment Methods
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const navigate = useNavigate();

  // Address book
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Load addresses from localStorage (Dashboard could also write to this key)
  useEffect(() => {
    // Prefill customer info once saved earlier
    try {
      const savedInfoRaw = localStorage.getItem('customerInfo');
      if (savedInfoRaw) {
        const savedInfo = JSON.parse(savedInfoRaw);
        setCustomerDetails(prev => ({
          ...prev,
          name: savedInfo.name || '',
          email: savedInfo.email || '',
          phone: savedInfo.phone || ''
        }));
      }
    } catch {}

    const raw = localStorage.getItem('addresses');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setAddresses(Array.isArray(parsed) ? parsed.slice(0, 1) : []);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedAddressId(parsed[0].id || 0);
        }
      } catch {}
    }
  }, []);

  // Lock page scroll while address modal is open
  useEffect(() => {
    if (showAddressModal) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [showAddressModal]);

  const persistAddresses = (next) => {
    setAddresses(next);
    localStorage.setItem('addresses', JSON.stringify(next));
  };

  const openAddAddress = () => {
    setEditingAddress({ id: Date.now(), name: '', phone: '', tag: 'HOME', line1: '', landmark: '', city: '', state: '', pincode: '' });
    setShowAddressModal(true);
  };

  const openEditAddress = (addr) => {
    setEditingAddress({ ...addr });
    setShowAddressModal(true);
  };

  const saveAddress = () => {
    if (!editingAddress.name || !editingAddress.phone || !editingAddress.line1 || !editingAddress.city || !editingAddress.pincode) {
      alert('Please fill all required fields (Name, Phone, Address, City, Pincode).');
      return;
    }
    if (!/^\d{6}$/.test(String(editingAddress.pincode))) {
      alert('Please enter a valid 6-digit pincode.');
      return;
    }
    const exists = addresses.some(a => a.id === editingAddress.id);
    let next;
    if (exists) {
      next = addresses.map(a => (a.id === editingAddress.id ? editingAddress : a));
    } else {
      // Only one address allowed: replace existing if present
      next = addresses.length > 0 ? [editingAddress] : [editingAddress];
    }
    persistAddresses(next);
    setSelectedAddressId(editingAddress.id);
    setShowAddressModal(false);
  };

  const deleteAddress = (id) => {
    const next = addresses.filter(a => a.id !== id);
    persistAddresses(next);
    if (selectedAddressId === id) {
      setSelectedAddressId(next[0]?.id ?? null);
    }
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Create order on backend
  const createOrder = async (amount) => {
    try {
      const response = await fetch('http://localhost:5000/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise
          currency: 'INR',
          receipt: `receipt_${Date.now()}`
        })
      });

      const data = await response.json();
      
      if (data.id) {
        return data;
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
    }
  };

  // Open Razorpay Checkout
  const openRazorpayCheckout = async (paymentMethod) => {
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Create order
      const order = await createOrder(totalAmount);
      console.log('Order created:', order);

      // Razorpay options
      const options = {
        key: 'rzp_live_RR0vKQoF2een0i', // Your key_id
        amount: order.amount,
        currency: order.currency,
        name: 'Organvi',
        description: 'Organic Products Purchase',
        order_id: order.id,
        image: 'https://your-logo-url.com/logo.png',
        handler: function (response) {
          console.log('Payment Success Response:', response);
          onPaymentSuccess(response);
        },
        prefill: {
          name: customerDetails.name,
          email: customerDetails.email,
          contact: customerDetails.phone,
        },
        notes: {
          address: customerDetails.address,
          items: JSON.stringify(cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })))
        },
        theme: {
          color: '#4CAF50'
        },
        modal: {
          ondismiss: function() {
            onPaymentFailure('Payment cancelled by user');
          }
        },
        // Enable specific payment method
        method: {
          netbanking: paymentMethod === 'netbanking',
          wallet: paymentMethod === 'wallet',
          upi: paymentMethod === 'upi',
          card: paymentMethod === 'card',
          emi: paymentMethod === 'emi'
        }
      };

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment Error:', error);
      onPaymentFailure('Payment failed: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      alert('Please fill in all required fields');
      return;
    }
    if (!selectedAddressId) {
      alert('Please select or add a delivery address.');
      return;
    }
    // Persist name/email/phone for future checkouts
    localStorage.setItem('customerInfo', JSON.stringify({
      name: customerDetails.name,
      email: customerDetails.email,
      phone: customerDetails.phone
    }));
    
    // Move to payment methods step
    setCurrentStep(2);
  };

  const handlePaymentMethod = (method) => {
    openRazorpayCheckout(method);
  };

  return (
    <div className="payment-form-container">
      <div className="payment-form">
        {currentStep === 1 ? (
          <h2>Complete Your Purchase</h2>
        ) : (
          <>
            <button className="back-icon-btn back-above" onClick={() => setCurrentStep(1)} aria-label="Back">
              <span className="back-icon">←</span>
            </button>
            <div className="pm-titles center">
              <h2>Choose Payment Method</h2>
              <p className="pm-subtitle">Select your preferred payment method:</p>
            </div>
          </>
        )}
        
        {/* Step 1: Address + Customer + Order Summary */}
        {currentStep === 1 && (
          <form onSubmit={handleSubmit} className="customer-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={customerDetails.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={customerDetails.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={customerDetails.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="address-group">
                <label>Delivery Address</label>
                <div className="address-list">
                  {addresses.map(addr => (
                    <div key={addr.id} className={`address-item ${selectedAddressId === addr.id ? 'selected' : ''}`}>
                      <label className="address-radio">
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                        />
                      </label>
                      <div className="address-content">
                        <div className="address-header-row">
                          <span className="address-person">{addr.name}</span>
                          <span className="address-tag">{addr.tag || 'HOME'}</span>
                          <span className="address-phone">{addr.phone}</span>
                        </div>
                        <div className="address-lines">
                          <span>{addr.line1}</span>
                          {addr.line2 && <span>{addr.line2}</span>}
                          <span>
                            {addr.city}{addr.state ? `, ${addr.state}` : ''} - {addr.pincode}
                          </span>
                        </div>
                        <div className="address-actions">
                          <button type="button" className="address-edit" onClick={() => openEditAddress(addr)}>EDIT</button>
                          <button type="button" className="address-delete" onClick={() => deleteAddress(addr.id)}>REMOVE</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {addresses.length === 0 && (
                    <div className="address-empty">No address found. Add one.</div>
                  )}
                  {addresses.length === 0 && (
                    <button type="button" className="add-address-link" onClick={openAddAddress}>+ Add a new address</button>
                  )}
                </div>
              </div>
            </div>

            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="order-items">
                {cartItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                    <span className="item-price">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="total-amount">
                <strong>Total: ₹{totalAmount}</strong>
              </div>
            </div>

            <button type="submit" className="next-btn">
              Choose Payment Method
            </button>
          </form>
        )}

        {/* Step 2: Payment Methods */}
        {currentStep === 2 && (
          <div className="payment-methods">
            <div className="payment-list" role="radiogroup" aria-label="Payment Method">
              <label className="payment-row" onClick={() => handlePaymentMethod('card')}>
                <input type="radio" name="payment" className="payment-radio" />
                <img className="payment-icon-img" src={cardIcon} alt="Card" />
                <span className="payment-row-text">Credit/Debit Card</span>
              </label>

              <label className="payment-row" onClick={() => handlePaymentMethod('upi')}>
                <input type="radio" name="payment" className="payment-radio" />
                <img className="payment-icon-img" src={upiIcon} alt="UPI" />
                <span className="payment-row-text">UPI</span>
              </label>

              <label className="payment-row" onClick={() => handlePaymentMethod('wallet')}>
                <input type="radio" name="payment" className="payment-radio" />
                <span className="payment-row-text">GPay / PhonePe / Paytm</span>
              </label>

              <label className="payment-row" onClick={() => handlePaymentMethod('netbanking')}>
                <input type="radio" name="payment" className="payment-radio" />
                <span className="payment-row-text">Net Banking</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="address-modal-overlay">
          <div className="address-modal">
            <h3>{editingAddress && addresses.some(a => a.id === editingAddress.id) ? 'Edit Address' : 'Add New Address'}</h3>
            
            <div className="address-modal-grid">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={editingAddress?.name || ''}
                  onChange={(e) => setEditingAddress(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter name"
                />
              </div>
              
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  value={editingAddress?.phone || ''}
                  onChange={(e) => setEditingAddress(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone"
                />
              </div>
              
              <div className="form-group">
                <label>Tag</label>
                <select
                  value={editingAddress?.tag || 'HOME'}
                  onChange={(e) => setEditingAddress(prev => ({ ...prev, tag: e.target.value }))}
                >
                  <option value="HOME">HOME</option>
                  <option value="WORK">WORK</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
              
              <div className="form-group full">
                <label>Address Line 1 *</label>
                <input
                  type="text"
                  value={editingAddress?.line1 || ''}
                  onChange={(e) => setEditingAddress(prev => ({ ...prev, line1: e.target.value }))}
                  placeholder="Enter address"
                />
              </div>
              
              {/* Address Line 2 removed as requested */}

              <div className="form-group full">
                <label>Landmark / Area</label>
                <input
                  type="text"
                  value={editingAddress?.landmark || ''}
                  onChange={(e) => setEditingAddress(prev => ({ ...prev, landmark: e.target.value }))}
                  placeholder="Nearby landmark or area"
                />
              </div>
              
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  value={editingAddress?.city || ''}
                  onChange={(e) => setEditingAddress(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Enter city"
                />
              </div>
              
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={editingAddress?.state || ''}
                  onChange={(e) => setEditingAddress(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="Enter state"
                />
              </div>
              
              <div className="form-group">
                <label>Pincode *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\\d{6}"
                  maxLength={6}
                  value={editingAddress?.pincode || ''}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                    setEditingAddress(prev => ({ ...prev, pincode: digitsOnly }));
                  }}
                  placeholder="Enter 6-digit pincode"
                />
              </div>
            </div>
            
            <div className="address-modal-actions">
              <button 
                type="button" 
                className="address-cancel"
                onClick={() => setShowAddressModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="address-save"
                onClick={saveAddress}
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Grid3X3, 
  MapPin, 
  Heart, 
  LogOut, 
  Check,
  ShoppingCart,
  User,
  Package,
  Truck,
  Clock,
  X,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import Address from './Address';
import ViewMoreDetails from '../Pulses/ViewMoreDetails';
import '../All_Categories/AllCategories.css';
import './Dashboard.css';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [showViewMore, setShowViewMore] = useState(false);
  const [selectedViewMoreProduct, setSelectedViewMoreProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState('500g');
  const [modalQuantity, setModalQuantity] = useState(1);
  const navigate = useNavigate();
  const { userData, phoneNumber, countryCode, logoutUser } = useUser();

  useEffect(() => {
    fetchOrders();
    fetchWishlist();
  }, []);

  // Listen for wishlist updates
  useEffect(() => {
    const handleWishlistUpdated = () => {
      fetchWishlist();
    };
    
    window.addEventListener('wishlistUpdated', handleWishlistUpdated);
    window.addEventListener('storage', handleWishlistUpdated);
    
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdated);
      window.removeEventListener('storage', handleWishlistUpdated);
    };
  }, []);

  const fetchWishlist = () => {
    try {
      const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      setWishlistProducts(savedWishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlistProducts([]);
    }
  };

  const fetchOrders = () => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
      setOrders(storedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleLogout = () => {
    // Clear user data and redirect to login
    logoutUser();
    navigate('/account');
  };

  const handleMakeFirstOrder = () => {
    navigate('/allcategories');
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleCancelOrder = (order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    const updatedOrders = orders.map(order => 
      order.orderId === selectedOrder.orderId 
        ? { ...order, status: 'cancelled', cancelReason, cancelledAt: new Date() }
        : order
    );
    
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setShowCancelModal(false);
    setCancelReason('');
    setSelectedOrder(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <Check size={16} className="status-icon delivered" />;
      case 'shipped':
      case 'in_transit':
      case 'out_for_delivery':
        return <Truck size={16} className="status-icon shipped" />;
      case 'cancelled':
        return <X size={16} className="status-icon cancelled" />;
      default:
        return <Clock size={16} className="status-icon processing" />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#FF9800',
      'confirmed': '#2196F3',
      'processing': '#9C27B0',
      'shipped': '#4CAF50',
      'in_transit': '#FF5722',
      'out_for_delivery': '#795548',
      'delivered': '#4CAF50',
      'cancelled': '#f44336',
      'returned': '#607D8B'
    };
    return colors[status] || '#666';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Order Placed',
      'confirmed': 'Order Confirmed',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'in_transit': 'In Transit',
      'out_for_delivery': 'Out for Delivery',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled',
      'returned': 'Returned'
    };
    return statusMap[status] || status;
  };

  const canCancelOrder = (order) => {
    return ['pending', 'confirmed', 'processing'].includes(order.status);
  };

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlistProducts.filter(product => product.id !== productId);
    setWishlistProducts(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    
    // Trigger wishlist count update in navbar
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: updatedWishlist.length }));
  };

  const openViewMore = (product) => {
    setSelectedViewMoreProduct(product);
    setShowViewMore(true);
  };

  const closeViewMore = () => {
    setShowViewMore(false);
    setSelectedViewMoreProduct(null);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedWeight(product.weight || '500g');
    setModalQuantity(1);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setSelectedWeight('500g');
    setModalQuantity(1);
  };

  const handleWeightChange = (weight) => {
    setSelectedWeight(weight);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = modalQuantity + change;
    if (newQuantity >= 1) {
      setModalQuantity(newQuantity);
    }
  };

  const getModalPrice = () => {
    if (!selectedProduct) return 0;
    return selectedWeight === '1kg' ? selectedProduct.price * 2 : selectedProduct.price;
  };

  const getModalOriginalPrice = () => {
    if (!selectedProduct) return 0;
    return selectedWeight === '1kg' ? selectedProduct.originalPrice * 2 : selectedProduct.originalPrice;
  };

  const handleModalAddToCart = () => {
    if (selectedProduct) {
      const cartItem = {
        id: `${selectedProduct.id}-${selectedWeight}`,
        name: selectedProduct.name,
        price: getModalPrice(),
        originalPrice: getModalOriginalPrice(),
        weight: selectedWeight,
        quantity: modalQuantity,
        image: selectedProduct.image
      };
      
      const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItemIndex = existingCart.findIndex(item => item.id === cartItem.id);
      
      if (existingItemIndex === -1) {
        const updatedCart = [...existingCart, cartItem];
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      } else {
        const updatedCart = existingCart.map(item =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + cartItem.quantity }
            : item
        );
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
      
      const finalCart = JSON.parse(localStorage.getItem('cart')) || [];
      const uniqueItems = finalCart.length;
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: uniqueItems }));
      
      closeModal();
    }
  };

  const fullName = userData ? `${userData.firstName} ${userData.lastName}` : 'User';
  const email = userData ? userData.email : '';

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="header-title">MY ACCOUNT</h1>
      </div>

      <div className="dashboard-content">
        {/* Left Sidebar */}
        <div className="sidebar">
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveSection('dashboard')}
            >
              <Grid3X3 size={20} />
              <span>Dashboard</span>
            </button>
            
            <button 
              className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveSection('orders')}
            >
              <Package size={20} />
              <span>Orders ({orders.length})</span>
            </button>
            
            <button 
              className={`nav-item ${activeSection === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveSection('addresses')}
            >
              <MapPin size={20} />
              <span>Addresses (0)</span>
            </button>
            
            <button 
              className={`nav-item ${activeSection === 'wishlist' ? 'active' : ''}`}
              onClick={() => setActiveSection('wishlist')}
            >
              <Heart size={20} />
              <span>Wishlist ({wishlistProducts.length})</span>
            </button>
            
            <button className="nav-item logout-btn" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>

        </div>

        {/* Main Content */}
        <div className="main-content">
          {activeSection === 'dashboard' && (
            <div className="dashboard-section">
              {/* Welcome Message */}
              <div className="welcome-section">
                <p className="welcome-text">
                  Hello {fullName} (not {fullName}? <button className="logout-link" onClick={handleLogout}>Log out</button>)
                </p>
              </div>

              {/* Dashboard now shows only account information. Orders have a dedicated section. */}

              {/* Account Details */}
              <div className="account-details-section">
                <h2 className="section-title">Account details:</h2>
                <div className="account-info">
                  <div className="info-row">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{fullName}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">E-mail:</span>
                    <span className="info-value">{email}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'orders' && (
            <div className="orders-section">
              <h2 className="section-title">All Orders</h2>
              {orders.length === 0 ? (
                <div className="empty-orders">
                  <Package size={48} className="empty-icon" />
                  <p className="empty-text">No orders found</p>
                  <button className="start-shopping-btn" onClick={handleMakeFirstOrder}>
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.orderId} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <span className="order-id">#{order.orderId}</span>
                          <span className="order-date">{new Date(order.orderDate).toLocaleDateString()}</span>
                        </div>
                        <div className="order-status">
                          {getStatusIcon(order.status)}
                          <span 
                            className="status-text"
                            style={{ color: getStatusColor(order.status) }}
                          >
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="order-content">
                        <div className="order-items">
                          <h4>Items ({order.items.length})</h4>
                          <div className="items-preview">
                            {order.items.slice(0, 2).map((item, index) => (
                              <div key={index} className="item-preview">
                                <img src={item.image} alt={item.name} className="item-image" />
                                <div className="item-info">
                                  <span className="item-name">{item.name}</span>
                                  <span className="item-quantity">Qty: {item.quantity}</span>
                                </div>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <div className="more-items">+{order.items.length - 2} more</div>
                            )}
                          </div>
                        </div>
                        
                        <div className="order-summary">
                          <div className="summary-row">
                            <span>Total Amount:</span>
                            <span className="total-amount">₹{order.totalAmount}</span>
                          </div>
                          <div className="summary-row">
                            <span>Payment Method:</span>
                            <span>{order.paymentMethod}</span>
                          </div>
                          <div className="summary-row">
                            <span>Delivery Address:</span>
                            <span className="delivery-address">
                              {order.shippingAddress?.line1}, {order.shippingAddress?.city}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="order-actions">
                        <button 
                          className="view-order-btn"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                        {canCancelOrder(order) && (
                          <button 
                            className="cancel-order-btn"
                            onClick={() => handleCancelOrder(order)}
                          >
                            <X size={16} />
                            Cancel Order
                          </button>
                        )}
                        <button 
                          className="track-order-btn"
                          onClick={() => navigate(`/order-tracking/${order.orderId}`)}
                        >
                          <Truck size={16} />
                          Track Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'addresses' && (
            <div className="addresses-section">
              <Address />
            </div>
          )}

          {activeSection === 'wishlist' && (
            <div className="wishlist-section">
              <h2 className="section-title">Wishlist</h2>
              {wishlistProducts.length === 0 ? (
                <div className="empty-wishlist">
                  <Heart size={48} className="empty-icon" />
                  <p className="empty-text">Your wishlist is empty</p>
                  <Link to="/allcategories" className="start-shopping-btn" style={{ marginTop: '1rem', display: 'inline-block' }}>
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="all-products-grid" style={{ marginTop: '1.5rem' }}>
                  {wishlistProducts.map((product) => (
                    <div key={product.id} className="product-card">
                      <div className="discount-badge">
                        Save {product.discount || 10}%
                      </div>
                      
                      <button 
                        className="heart-icon liked"
                        onClick={() => removeFromWishlist(product.id)}
                        title="Remove from wishlist"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                      </button>
                      
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
                          <span className="original-price">₹{product.originalPrice || product.price}</span>
                        </div>
                        
                        <div className="view-details-section">
                          <button 
                            className="view-details-link"
                            onClick={() => openViewMore(product)}
                          >
                            View More Details
                          </button>
                        </div>
                        
                        <div className="product-actions">
                          <button 
                            className="add-btn"
                            onClick={() => openModal(product)}
                          >
                            <span>Add To Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Delivery Icon */}
      <div className="floating-delivery">
        <ShoppingCart size={24} />
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="order-modal">
            <div className="modal-header">
              <h3>Order Details - #{selectedOrder.orderId}</h3>
              <button 
                className="close-modal-btn"
                onClick={() => setShowOrderModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="unified-order-modal">
              <h4>Order Details</h4>
              <div className="order-info-section">
                <div className="detail-row">
                  <span>Order ID:</span>
                  <span>{selectedOrder.orderId}</span>
                </div>
                <div className="detail-row">
                  <span>Order Date:</span>
                  <span>{new Date(selectedOrder.orderDate).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span>Status:</span>
                  <span 
                    className="status-badge"
                    style={{ color: getStatusColor(selectedOrder.status) }}
                  >
                    {getStatusIcon(selectedOrder.status)}
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
                <div className="detail-row">
                  <span>Total Amount:</span>
                  <span className="amount">₹{selectedOrder.totalAmount}</span>
                </div>
              </div>

              <div className="customer-info-section">
                <div className="detail-row">
                  <span>Name:</span>
                  <span>{selectedOrder.customerDetails?.name}</span>
                </div>
                <div className="detail-row">
                  <span>Email:</span>
                  <span>{selectedOrder.customerDetails?.email}</span>
                </div>
                <div className="detail-row">
                  <span>Phone:</span>
                  <span>{selectedOrder.customerDetails?.phone}</span>
                </div>
                <div className="detail-row">
                  <span>Delivery Address:</span>
                  <span>
                    {selectedOrder.shippingAddress?.line1}
                    {selectedOrder.shippingAddress?.line2 && `, ${selectedOrder.shippingAddress.line2}`}
                    <br />
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                  </span>
                </div>
              </div>

              <div className="order-items-section">
                <h5>Order Items</h5>
                <div className="items-list">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img src={item.image} alt={item.name} className="item-image" />
                      <div className="item-details">
                        <h6>{item.name}</h6>
                        <p>Size: {item.weight}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ₹{item.price}</p>
                      </div>
                      <div className="item-total">
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.cancelReason && (
                <div className="cancellation-section">
                  <h5>Cancellation Details</h5>
                  <div className="detail-row">
                    <span>Reason:</span>
                    <span>{selectedOrder.cancelReason}</span>
                  </div>
                  {selectedOrder.cancelledAt && (
                    <div className="detail-row">
                      <span>Cancelled At:</span>
                      <span>{new Date(selectedOrder.cancelledAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button 
                className="track-order-btn"
                onClick={() => {
                  setShowOrderModal(false);
                  navigate(`/order-tracking/${selectedOrder.orderId}`);
                }}
              >
                <Truck size={16} />
                Track Order
              </button>
              {canCancelOrder(selectedOrder) && (
                <button 
                  className="cancel-order-btn"
                  onClick={() => {
                    setShowOrderModal(false);
                    handleCancelOrder(selectedOrder);
                  }}
                >
                  <X size={16} />
                  Cancel Order
                </button>
              )}
              
            </div>
          </div>
        </div>
      )}

      {/* Removed separate Cancel Order Modal */}

      {/* View More Details Modal */}
      {showViewMore && selectedViewMoreProduct && (
        <ViewMoreDetails 
          product={selectedViewMoreProduct} 
          onClose={closeViewMore} 
        />
      )}

      {/* Add to Cart Modal */}
      {showModal && selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} title="Close">
              ×
            </button>
            
            <div className="modal-product-info">
              <div className="modal-product-image">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>
              <div className="modal-product-details">
                <h3 className="modal-product-name">{selectedProduct.name}</h3>
                <div className="modal-pricing">
                  <span className="modal-original-price">₹{getModalOriginalPrice().toFixed(2)}</span>
                  <span className="modal-current-price">₹{getModalPrice().toFixed(2)}</span>
                  <p className="modal-tax-info">(Inc. of all taxes)</p>
                </div>
              </div>
            </div>

            <div className="modal-size-section">
              <p className="modal-size-label">Size: {selectedWeight}</p>
              <div className="modal-weight-options">
                <button 
                  className={`modal-weight-btn ${selectedWeight === '500g' ? 'selected' : ''}`}
                  onClick={() => handleWeightChange('500g')}
                >
                  <span className="weight-text">500 g</span>
                  <div className="weight-pricing">
                    <span className="weight-original-price">₹{selectedProduct.originalPrice?.toFixed(2) || selectedProduct.price.toFixed(2)}</span>
                    <span className="weight-current-price">₹{selectedProduct.price.toFixed(2)}</span>
                  </div>
                  <div className="discount-badge-modal">{selectedProduct.discount || 10}% OFF</div>
                </button>
                
                <button 
                  className={`modal-weight-btn ${selectedWeight === '1kg' ? 'selected' : ''}`}
                  onClick={() => handleWeightChange('1kg')}
                >
                  <span className="weight-text">1 kg</span>
                  <div className="weight-pricing">
                    <span className="weight-original-price">₹{((selectedProduct.originalPrice || selectedProduct.price) * 2).toFixed(2)}</span>
                    <span className="weight-current-price">₹{(selectedProduct.price * 2).toFixed(2)}</span>
                  </div>
                  <div className="discount-badge-modal">{selectedProduct.discount || 10}% OFF</div>
                </button>
              </div>
            </div>

            <div className="modal-quantity-section">
              <div className="modal-quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(-1)}
                >
                  -
                </button>
                <span className="quantity-display">{modalQuantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button className="modal-add-to-cart-btn" onClick={handleModalAddToCart}>
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

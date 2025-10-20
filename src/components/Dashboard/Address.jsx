import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, X } from 'lucide-react';
import './Address.css';

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    country: '',
    postalCode: '',
    phone: '',
    isDefault: false
  });

  // Load addresses from localStorage on component mount
  useEffect(() => {
    const loadAddresses = () => {
      try {
        const savedAddresses = localStorage.getItem('addresses');
        if (savedAddresses) {
          const parsedAddresses = JSON.parse(savedAddresses);
          setAddresses(Array.isArray(parsedAddresses) ? parsedAddresses : []);
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
        setAddresses([]);
      }
    };
    loadAddresses();
  }, []);

  // Save addresses to localStorage whenever addresses change
  const saveAddressesToStorage = (newAddresses) => {
    try {
      localStorage.setItem('addresses', JSON.stringify(newAddresses));
    } catch (error) {
      console.error('Error saving addresses:', error);
    }
  };

  const handleAddAddress = () => {
    setShowAddForm(true);
    setEditingAddress(null);
    setFormData({
      firstName: '',
      lastName: '',
      company: '',
      address: '',
      apartment: '',
      city: '',
      country: '',
      postalCode: '',
      phone: '',
      isDefault: false
    });
  };

  const handleEditAddress = (address) => {
    // Find the index of the address to edit
    const addressIndex = addresses.findIndex(addr => addr.id === address.id);
    setEditingAddress(addressIndex);
    
    // Convert address back to form format
    const nameParts = address.name.split(' ');
    setFormData({
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      company: '',
      address: address.line1,
      apartment: address.line2 || '',
      city: address.city,
      country: address.state,
      postalCode: address.pincode,
      phone: address.phone,
      isDefault: false
    });
    setShowAddForm(true);
  };

  const handleDeleteAddress = (index) => {
    const newAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(newAddresses);
    saveAddressesToStorage(newAddresses);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newAddresses;
    
    if (editingAddress !== null) {
      // Update existing address - convert to PaymentForm format
      const updatedAddress = {
        id: addresses[editingAddress].id,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        tag: 'HOME',
        line1: formData.address,
        line2: formData.apartment,
        landmark: '', // Not used in current Address component
        city: formData.city,
        state: formData.country,
        pincode: formData.postalCode
      };
      newAddresses = addresses.map((addr, index) => 
        index === editingAddress ? updatedAddress : addr
      );
    } else {
      // Add new address - convert to PaymentForm format
      const newAddress = {
        id: Date.now(),
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        tag: 'HOME',
        line1: formData.address,
        line2: formData.apartment,
        landmark: '', // Not used in current Address component
        city: formData.city,
        state: formData.country,
        pincode: formData.postalCode
      };
      newAddresses = [...addresses, newAddress];
    }
    
    setAddresses(newAddresses);
    saveAddressesToStorage(newAddresses);
    setShowAddForm(false);
    setEditingAddress(null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingAddress(null);
    setFormData({
      firstName: '',
      lastName: '',
      company: '',
      address: '',
      apartment: '',
      city: '',
      country: '',
      postalCode: '',
      phone: '',
      isDefault: false
    });
  };

  return (
    <div className="address-container">
      <div className="address-header">
        <h2 className="address-title">Addresses</h2>
        <button className="add-address-btn" onClick={handleAddAddress}>
          <Plus size={20} />
          <span>Add New Address</span>
        </button>
      </div>

      {addresses.length === 0 && !showAddForm ? (
        <div className="empty-addresses">
          <MapPin size={48} className="empty-icon" />
          <h3 className="empty-title">No addresses saved</h3>
          <p className="empty-subtitle">Add your first address to get started</p>
          <button className="add-first-address-btn" onClick={handleAddAddress}>
            <Plus size={20} />
            <span>Add Address</span>
          </button>
        </div>
      ) : (
        <div className="addresses-list">
          {addresses.map((address, index) => (
            <div key={address.id || index} className="address-card">
              <div className="address-info">
                <div className="address-details">
                  <h4 className="address-name">{address.name}</h4>
                  <p className="address-phone">{address.phone}</p>
                  <p className="address-text">
                    {address.line1}
                    {address.line2 && `, ${address.line2}`}
                    <br />
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  {address.tag && (
                    <span className="default-badge">{address.tag}</span>
                  )}
                </div>
              </div>
              <div className="address-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEditAddress(address)}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteAddress(index)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <div className="address-form-overlay">
          <div className="address-form-container">
            <div className="form-header">
              <h3 className="form-title">
                {editingAddress !== null ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button className="close-btn" onClick={handleCancel}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="address-form">
              {/* First Name and Last Name */}
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="First Name"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Last Name"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Company */}
              <div className="form-group">
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  placeholder="Company"
                  className="form-input"
                />
              </div>

              {/* Address */}
              <div className="form-group">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Address"
                  className="form-input"
                  required
                />
              </div>

              {/* Apartment */}
              <div className="form-group">
                <input
                  type="text"
                  value={formData.apartment}
                  onChange={(e) => setFormData({...formData, apartment: e.target.value})}
                  placeholder="Apartment, suite, etc."
                  className="form-input"
                />
              </div>

              {/* City */}
              <div className="form-group">
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  placeholder="City"
                  className="form-input"
                  required
                />
              </div>

              {/* Country and Postal Code */}
              <div className="form-row">
                <div className="form-group">
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="form-select"
                    required
                  >
                    <option value="">Country/region</option>
                    <option value="India">India</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                    placeholder="Postal/Zip Code"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="form-group">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Phone"
                  className="form-input"
                  required
                />
              </div>

              {/* Default Address Checkbox */}
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">Set as default address</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="add-address-btn">
                  {editingAddress !== null ? 'Update Address' : 'Add Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Address;

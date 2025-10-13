import React, { useState } from 'react';
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
    setEditingAddress(address);
    setFormData(address);
    setShowAddForm(true);
  };

  const handleDeleteAddress = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAddress) {
      // Update existing address
      setAddresses(addresses.map((addr, index) => 
        index === editingAddress ? formData : addr
      ));
    } else {
      // Add new address
      setAddresses([...addresses, { ...formData, id: Date.now() }]);
    }
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
                  <h4 className="address-name">{address.firstName} {address.lastName}</h4>
                  {address.company && <p className="address-company">{address.company}</p>}
                  <p className="address-phone">{address.phone}</p>
                  <p className="address-text">
                    {address.address}
                    {address.apartment && `, ${address.apartment}`}
                    <br />
                    {address.city}, {address.country} - {address.postalCode}
                  </p>
                  {address.isDefault && (
                    <span className="default-badge">Default Address</span>
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
                {editingAddress ? 'Edit Address' : 'Add New Address'}
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
                  Add Address
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

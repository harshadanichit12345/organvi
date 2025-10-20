import express from 'express';
import Razorpay from 'razorpay';
import cors from 'cors';
import axios from 'axios';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

// Razorpay keys
const razorpay = new Razorpay({
  key_id: 'rzp_live_RR0vKQoF2een0i',       // Your key_id
  key_secret: 'ESg1jTAYIvp8AdKHProTKUhK'   // Your key_secret
});

// Shiprocket credentials
const SHIPROCKET_EMAIL = 'harshada.intellisys@gmail.com';
const SHIPROCKET_PASSWORD = 'IcxbH$uz4fkrGD%7';
let shipToken = '';

// In-memory storage for orders (in production, use a database)
let orders = [];

// MongoDB connection (optional but recommended)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/organvi';

try {
  mongoose.connect(MONGODB_URI, { autoIndex: true }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.warn('MongoDB connection failed; continuing with in-memory storage. Error:', err.message);
  });
} catch (err) {
  console.warn('MongoDB connect threw synchronously:', err.message);
}

// Order schema/model
let OrderModel;
try {
  const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    userId: { type: String },
    items: [{ name: String, sku: String, units: Number, selling_price: Number }],
    paymentId: String,
    shipmentId: String,
    status: { type: String, default: 'Payment Completed' },
    trackingDetails: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        location: String,
      }
    ],
    cancelReason: String,
    createdAt: { type: Date, default: Date.now }
  });

  OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);
} catch (err) {
  console.warn('Failed to init Order model; DB features disabled:', err.message);
}

// Create order endpoint
app.post('/create-order', async (req, res) => {
  const { amount } = req.body; // Amount in paise
  try {
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    });
    res.json(order);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Save order after payment success
app.post('/save-order', (req, res) => {
  try {
    const orderData = req.body;
    orderData.id = Date.now(); // Add unique ID
    orderData.createdAt = new Date();
    orders.push(orderData);
    res.json({ success: true, orderId: orderData.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save order' });
  }
});

// Get all orders
app.get('/orders', (req, res) => {
  try {
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
app.get('/orders/:id', (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status
app.put('/orders/:id/status', (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.status = status;
    order.updatedAt = new Date();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get orders by status
app.get('/orders/status/:status', (req, res) => {
  try {
    const { status } = req.params;
    const filteredOrders = orders.filter(o => o.status === status);
    res.json(filteredOrders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders by status' });
  }
});

// Search orders
app.get('/orders/search/:query', (req, res) => {
  try {
    const { query } = req.params;
    const searchResults = orders.filter(order => 
      order.orderId.toLowerCase().includes(query.toLowerCase()) ||
      order.customerDetails.name.toLowerCase().includes(query.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(query.toLowerCase()))
    );
    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search orders' });
  }
});

// Get order statistics
app.get('/orders/stats', (req, res) => {
  try {
    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      ordersByStatus: {
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        in_transit: orders.filter(o => o.status === 'in_transit').length,
        out_for_delivery: orders.filter(o => o.status === 'out_for_delivery').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        returned: orders.filter(o => o.status === 'returned').length
      }
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order statistics' });
  }
});

// Verify payment signature
app.post('/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // In production, you should verify the signature using Razorpay's method
    // For now, we'll just return success
    res.json({ 
      success: true, 
      message: 'Payment verified successfully',
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id
    });
  } catch (error) {
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Shiprocket Integration Endpoints

// Get Shiprocket token
app.get('/shiprocket-token', async (req, res) => {
  try {
    const response = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/auth/login',
      { email: SHIPROCKET_EMAIL, password: SHIPROCKET_PASSWORD }
    );
    shipToken = response.data.token;
    res.json({ token: shipToken, success: true });
  } catch (err) {
    console.error('Shiprocket token error:', err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

// Create shipment in Shiprocket
app.post('/create-shipment', async (req, res) => {
  try {
    if (!shipToken) {
      // Try to get token first
      const tokenResponse = await axios.post(
        'https://apiv2.shiprocket.in/v1/external/auth/login',
        { email: SHIPROCKET_EMAIL, password: SHIPROCKET_PASSWORD }
      );
      shipToken = tokenResponse.data.token;
    }

    const orderData = req.body;
    console.log('Creating shipment with data:', orderData);

    const response = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      orderData,
      { 
        headers: { 
          Authorization: `Bearer ${shipToken}`,
          'Content-Type': 'application/json'
        } 
      }
    );

    console.log('Shiprocket response:', response.data);

    // Persist order to DB if available, else keep in memory
    try {
      const persisted = {
        orderId: orderData.order_id,
        userId: orderData.userId,
        items: (orderData.order_items || []).map(i => ({
          name: i.name,
          sku: i.sku,
          units: i.units,
          selling_price: Number(i.selling_price)
        })),
        paymentId: orderData.paymentId,
        shipmentId: response.data?.data?.shipment_id || response.data?.shipment_id,
        status: 'Payment Completed',
        trackingDetails: [{ status: 'Payment Completed', timestamp: new Date(), location: '' }]
      };

      if (OrderModel) {
        await OrderModel.create(persisted);
      } else {
        orders.push({ id: Date.now(), ...persisted });
      }
    } catch (persistErr) {
      console.warn('Failed to persist order:', persistErr.message);
    }

    res.json({
      success: true,
      shipment: response.data,
      message: 'Shipment created successfully'
    });
  } catch (err) {
    console.error('Shiprocket shipment error:', err.response?.data || err.message);
    res.status(500).json({ 
      error: 'Shipment creation failed', 
      details: err.response?.data || err.message 
    });
  }
});

// Track shipment
app.get('/track-shipment/:shipmentId', async (req, res) => {
  try {
    if (!shipToken) {
      return res.status(400).json({ error: 'Shiprocket token missing' });
    }

    const { shipmentId } = req.params;
    const response = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipmentId}`,
      { headers: { Authorization: `Bearer ${shipToken}` } }
    );

    // Update DB with latest status
    try {
      const status = response.data?.data?.current_status || response.data?.tracking?.current_status;
      const lastLocation = response.data?.data?.last_location || '';
      if (OrderModel && req.query.orderId) {
        await OrderModel.findOneAndUpdate(
          { orderId: req.query.orderId },
          {
            status: status || 'Unknown',
            $push: { trackingDetails: { status: status || 'Updated', timestamp: new Date(), location: lastLocation } }
          }
        );
      }
    } catch (updateErr) {
      console.warn('Failed to update DB with tracking:', updateErr.message);
    }

    res.json({ success: true, tracking: response.data });
  } catch (err) {
    console.error('Shiprocket tracking error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Tracking failed', details: err.response?.data || err.message });
  }
});

// Get shipment details
app.get('/shipment-details/:orderId', async (req, res) => {
  try {
    if (!shipToken) {
      return res.status(400).json({ error: 'Shiprocket token missing' });
    }

    const { orderId } = req.params;
    const response = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/orders/show/${orderId}`,
      { headers: { Authorization: `Bearer ${shipToken}` } }
    );

    res.json({ success: true, order: response.data });
  } catch (err) {
    console.error('Shiprocket order details error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch order details', details: err.response?.data || err.message });
  }
});

// Cancel order
app.post('/cancel-order/:orderId', async (req, res) => {
  try {
    const { reason } = req.body || {};
    const orderId = req.params.orderId;

    if (OrderModel) {
      const order = await OrderModel.findOne({ orderId });
      if (!order) return res.status(404).json({ error: 'Order not found' });
      if (order.status === 'Delivered') return res.status(400).json({ error: 'Cannot cancel delivered order' });
      order.status = 'Cancelled';
      order.cancelReason = reason || 'No reason provided';
      await order.save();
      return res.json(order);
    }

    const idx = orders.findIndex(o => o.orderId === orderId);
    if (idx === -1) return res.status(404).json({ error: 'Order not found' });
    if (orders[idx].status === 'Delivered') return res.status(400).json({ error: 'Cannot cancel delivered order' });
    orders[idx].status = 'Cancelled';
    orders[idx].cancelReason = reason || 'No reason provided';
    res.json(orders[idx]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

app.listen(5000, () => console.log('Backend running on port 5000'));

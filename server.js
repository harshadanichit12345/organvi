import express from 'express';
import Razorpay from 'razorpay';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Razorpay keys
const razorpay = new Razorpay({
  key_id: 'rzp_live_RR0vKQoF2een0i',       // Your key_id
  key_secret: 'ESg1jTAYIvp8AdKHProTKUhK'   // Your key_secret
});

// Create order endpoint
app.post('/create-order', async (req, res) => {
  const { amount } = req.body; // Amount in paise
  try {
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: 'receipt#1'
    });
    res.json(order);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(5000, () => console.log('Backend running on port 5000'));

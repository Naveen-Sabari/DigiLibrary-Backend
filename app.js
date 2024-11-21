const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config/config.env') });
const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDatabase = require('./config/connectDatabase');
const products = require('./routes/product');
const orders = require('./routes/order');
const authRoutes = require('./routes/auth');
const authLoginRoutes = require('./routes/authlogin');
const userRoutes = require('./routes/user');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcryptjs');
const app = express();
const DOMAIN = process.env.DOMAIN ;
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const allowedOrigins = [
  process.env.CLIENT_URL_DEV ,
  process.env.CLIENT_URL_PROD,
  process.env.IMP,
  process.env.IMP1,
  process.env.IMP2
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(bodyParser.json());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

connectDatabase();

app.use('/api/v1', authRoutes);
app.use('/api/v1', authLoginRoutes);
app.use('/api/v1/products', products);
app.use('/api/v1/orders', orders);
app.use('/api/v1/users', userRoutes);

app.post('/checkout', async (req, res) => {
  try {
    if (!req.body.items || req.body.items.length === 0) {
      return res.status(400).json({ error: 'No items provided for checkout' });
    }
    const line_items = req.body.items.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          images: [item.image[0]],
        },
        unit_amount: item.price * 100, 
      },
      quantity: item.quantity, 
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: 'payment',
      success_url: `${DOMAIN}/success`, 
      cancel_url: `${DOMAIN}/cancel`,  
    });

    res.status(200).json({ id: session.id });
  } catch (error) { res.status(500).send({ message: 'Internal Server Error', error: error.message });
  }
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Server error' });
});

app.listen(process.env.PORT || 8000, () => {});

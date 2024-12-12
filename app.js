const express = require('express');
const app = express();
const cors = require('cors'); 
const dotenv = require('dotenv');
const connectDatabase = require('./config/connectDatabase');
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

connectDatabase();

app.use(express.json());

const products = require('./routes/product');
const orders = require('./routes/order');
const authRoutes = require('./routes/auth');
const authLoginRoutes = require('./routes/authlogin');
const userRoutes = require('./routes/user');

const corsOptions = {
  origin: [process.env.CORS_ORIGIN, process.env.CORS_ORIGIN1, process.env.CORS_ORIGIN2], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.post('/checkout', async (req, res) => {
  const { lineItems } = req.body;  

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL,
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error', error: error.message });
  }
});

app.use('/api/v1', authRoutes);
app.use('/api/v1', authLoginRoutes);
app.use('/api/v1/products', products);
app.use('/api/v1/orders', orders);
app.use('/api/v1/users', userRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require('express');
const app = express();
const cors = require('cors'); 
const dotenv = require('dotenv');
const connectDatabase = require('./config/connectDatabase');
app.use(express.json());
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

connectDatabase();
const products = require('./routes/product');
const orders = require('./routes/order');
const authRoutes = require('./routes/auth');
const authLoginRoutes = require('./routes/authlogin');
const userRoutes = require('./routes/user');





const allowedOrigins = [

  process.env.IMP,
  process.env.IMP1,
  process.env.IMP2,
  process.env.IMP3,
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
}));










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

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
const port = process.env.PORT  

app.listen(port, () => {});

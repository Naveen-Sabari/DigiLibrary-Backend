const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./config/connectDatabase');
const products = require('./routes/product');
const orders = require('./routes/order');
const authRoutes = require('./routes/auth');
const authLoginRoutes = require('./routes/authlogin');
const userRoutes = require('./routes/user');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcryptjs');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const app = express();

dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

// Define allowed origins
const allowedOrigins = [
  process.env.CLIENT_URL_DEV, 
  process.env.CLIENT_URL_PROD  
];

// CORS Middleware - Custom CORS Handling
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL_PROD);  // Allow requests from the production front-end
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');   // Allowed HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies)
  next();
});

// CORS Middleware - Using the cors package
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

connectDatabase();

// Define your routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', authLoginRoutes);
app.use('/api/v1/products', products);
app.use('/api/v1/orders', orders);
app.use('/api/v1/users', userRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode`);
  console.log(`MongoDB connected with URL: ${process.env.DB_URL}`);
  console.log(`Server is listening on port ${process.env.PORT}`);
});

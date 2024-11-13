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


app.use(cors({
  origin: 'http://localhost:4200',  
}));
app.use(express.json()); 

connectDatabase();


// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1', authRoutes);           
app.use('/api/v1', authLoginRoutes);      
app.use('/api/v1/products', products);         
app.use('/api/v1/orders', orders);            
app.use('/api/v1/users', userRoutes);         


app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});


app.listen(process.env.PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode`);
  console.log(`MongoDB connected with URL: ${process.env.DB_URL}`);
  console.log(`Server is listening on port ${process.env.PORT}`);
});

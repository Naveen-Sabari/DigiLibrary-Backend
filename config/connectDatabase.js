const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); 

const connectDatabase = async () => {
  try {
    console.log('Mongo URI:', process.env.DB_URL);
    if (!process.env.DB_URL) {
      throw new Error('Mongo URI is not defined');
    }
    const conn = await mongoose.connect(process.env.DB_URL); 
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);  
  }
};

module.exports = connectDatabase;

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); 

const connectDatabase = async () => {
  try {
    if (!process.env.DB_URL) {
      throw new Error('Mongo URI is not defined');
    }
    const conn = await mongoose.connect(process.env.DB_URL); 
   
  } catch (error) {

    process.exit(1);  
  }
};

module.exports = connectDatabase;

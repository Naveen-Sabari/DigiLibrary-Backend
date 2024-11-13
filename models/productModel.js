const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  ratings: { type: Number, required: true },
  category: { type: String, required: true },
  seller: { type: String, required: true },
  stock: { type: Number, required: true },
  images: [{ type: String }],  
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

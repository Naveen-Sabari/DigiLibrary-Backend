const cloudinary = require('cloudinary').v2;
const productModel = require('../models/productModel'); 
const fs = require("fs");
const path = require("path");


const uploadDir = 'uploads';


if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

exports.createProduct = async (req, res) => {
  try {
   
  
    const { name, price, description, category, seller, stock, ratings, images } = req.body;

    if (!name || !price || !description || !category || !seller || stock === undefined || ratings === undefined || !images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All fields are required, and an image URL must be provided",
      });
    }
    let image = images[0];
    if (image.startsWith('data:image')) {
     
      const cloudinaryResponse = await cloudinary.uploader.upload(image, { 
        resource_type: 'auto', 
      });
      image = cloudinaryResponse.secure_url; 

    } else if (image.startsWith('http')) {

    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid image format. Please provide either a valid URL or a base64 encoded string.",
      });
    }
    const newProduct = new productModel({
      name,
      price,
      description,
      category,
      seller,
      stock,
      ratings,
      images: [image], 
    });
    const savedProduct = await newProduct.save();
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};


exports.getProducts = async (req, res) => {
  try {
    const query = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};
    const products = await productModel.find(query);

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
      error: error.message,
    });
  }
};

exports.getSingleProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching product",
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await productModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while deleting product",
      error: error.message,
    });
  }
};

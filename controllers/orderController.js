const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");

exports.CreateOrder = async (req, res, next) => {
  const cartItems = req.body; 
  let amount = 0;

  try {
    amount = cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0).toFixed(2);

    const status = 'pending';  
    const order = await orderModel.create({
      cartItems,
      amount,
      status,
    });

    
    for (const item of cartItems) {
      const product = await productModel.findById(item.product._id);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product with ID ${item.product._id} not found.` });
      }
      
        if (product.stock < item.qty) {
        return res.status(400).json({ success: false, message: `Not enough stock for product ${product.name}` });
      }
      product.stock -= item.qty;
      await product.save();
    }
    res.json({
      success: true,
      order,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Something went wrong while creating the order.',
      error: error.message,
    });
  }
};

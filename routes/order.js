const express =require("express");
const { CreateOrder } = require("../controllers/orderController");
const router =express.Router();


router.route('/order').post(CreateOrder);

module.exports=router;
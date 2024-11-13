const express = require('express');
const router = express.Router();


const { getProducts, createProduct, getSingleProduct, deleteProduct } = require('../controllers/productController');


router.get('/', getProducts); 
router.post('/', createProduct); 
router.get('/:id', getSingleProduct); 
router.delete('/:id', deleteProduct); 

module.exports = router;

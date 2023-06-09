const express = require('express');
const router = express.Router();
const { getAllproduct, createProduct,updateproduct, deleteProduct,
         productdetails } = require('../controller/productController');
const { isauthenticated, isautherised } = require('../middleware/auth');

//create product
router.route('/product/new')
.post(isauthenticated, isautherised("admin"), createProduct);

//getallproduct
router.route('/products').get( getAllproduct);


//updateproduct
router.route('/product/:id')
.get(productdetails)
.put(isauthenticated,isautherised("admin"), updateproduct)
.delete(isauthenticated,isautherised("admin"), deleteProduct);


module.exports = router;
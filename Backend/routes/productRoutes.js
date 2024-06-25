const express = require('express');
const { addProduct, getProducts, removeProduct, updateProductStatus } = require('../controllers/productController');

const router = express.Router();

router.post('/add', addProduct);
router.get('/', getProducts);
router.delete('/:id', removeProduct);
router.put('/status/:id', updateProductStatus);

module.exports = router;

const Product = require('../models/Product');

const addProduct = async (req, res) => {
    const { name, tag, price, quantity } = req.body;
    try {
        const newProduct = new Product({ name, tag, price, quantity });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add product' });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

const removeProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: 'Product removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove product' });
    }
};

const updateProductStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product status' });
    }
};

module.exports = { addProduct, getProducts, removeProduct, updateProductStatus };

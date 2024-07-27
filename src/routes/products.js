const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const eventEmitter = require('../events/events');

router.get('/products', async (req, res) => {
    try {
        const items = await Product.find({});
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/product', async (req, res) => {
    try {
        const newProduct = new Product({
            pid: parseInt(req.body.pid),
            name: req.body.name,
            company: req.body.company,
            rating: parseFloat(req.body.rating),
            price: parseFloat(req.body.price),
            description: req.body.description,
            imgsrc: req.body.imgsrc
        });

        await newProduct.save();
        eventEmitter.emit('productAdded', { message: 'New Product added successfully!!' });

        res.status(201).json({ message: 'New Product added successfully!!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add product!' });
    }
});

router.delete('/product', async (req, res) => {
    try {
        const pidToDelete = req.body.pid;
        const productToDelete = await Product.findOne({ pid: pidToDelete });

        if (!productToDelete) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await Product.deleteOne({ pid: pidToDelete });
        eventEmitter.emit('productDeleted', { message: 'Product deleted successfully' });

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete product' });
    }
});

router.patch('/product', async (req, res) => {
    try {
        const pidToUpdate = req.body.pid;
        const newPrice = req.body.price;
        const productToUpdate = await Product.findOne({ pid: pidToUpdate });

        if (!productToUpdate) {
            return res.status(404).json({ message: 'Product not found' });
        }

        productToUpdate.price = newPrice;
        await productToUpdate.save();

        res.status(200).json({ message: 'Product price updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update product price' });
    }
});

module.exports = router;
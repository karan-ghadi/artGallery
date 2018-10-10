const mongoose = require('mongoose');
const express = require('express');
const product = require('../models/product');
const router = express.Router();



const getAllProducts = (req, res, next) => {
	res.status(201).json({
		message: 'get all products'
	})
}

router.get('/', getAllProducts);
module.exports = router;
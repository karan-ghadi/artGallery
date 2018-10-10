const mongoose = require('mongoose');
const express = require('express');
const product = require('../models/product');
const router = express.Router();


//** error function */
const catchError = (err) => {
	res.status(404).json({
		message: e,
	});
}

const getAllProducts = (req, res, next) => {
	product.find()
		.exec()
		.then((result) => {
			getAllProductData(result);
		}).catch((err) => {
			catchError(err);
		});

	const getAllProductData = (d) => {
		(!d || d == '') ? res.status(201).json({
			message: 'no product found'
		}) : res.status(201).json({
			message: 'products successfully fetched',
			product: d
		});
	};

}

router.get('/', getAllProducts);
module.exports = router;
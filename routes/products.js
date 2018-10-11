const mongoose = require('mongoose');
const express = require('express');
const Product = require('../models/product');
const router = express.Router();



const getAllProducts = (req, res, next) => {
	Product.find()
		.exec()
		.then((result) => {
			productQuery(result);
		}).catch((err) => {
			catchError(err);
		});

	const productQuery = (d) => {
		(!d || d == '') ? res.status(201).json({
			message: 'no product found'
		}): res.status(201).json({
			product: d,
			message: 'products successfully fetched'
		});
	};
	const catchError = (err) => {
		res.status(404).json({
			message: err
		});
	}

}

//** get single product */
const getSingleProduct = (req, res, next) => {
	const productId = req.params.id;

	Product.findOne({
			_id: productId
		})
		.exec()
		.then((result) => {
			res.status(201).json({
				product: result
			});
		}).catch((err) => {
			catchError(err);
		});

	const catchError = (err) => {
		res.status(404).json({
			message: err
		});
	}

}

//** add single product */

const addProducts = (req, res, next) => {
	const reqBody = req.body
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: reqBody.name,
		description: reqBody.description,
		price: reqBody.price,
		quantity: reqBody.quantity,
	});


	(!(product.name && product.description && product.price && product.quantity)) ? res.status(404).json({
		message: 'please fill all the product details'
	}): product.save().then((result) => {
		res.status(201).json({
			name: result
		})
	}).catch((err) => {
		catchError(err);
	});

	const catchError = (err) => {
		res.status(404).json({
			message: err
		});
	}
}

//** update product */
const updateProducts = (req, res, next) => {
	const productId = req.params.id;
	const reqBody = req.body;
	Product.findOne({
			_id: productId
		})
		.exec()
		.then((result) => {
			productQuery(result);
		}).catch((err) => {
			catchError(err);
		});

	const productQuery = (d) => {
		Product.updateOne({
				_id: d
			}, {
				name: reqBody.name,
				description: reqBody.description,
				price: reqBody.price,
				quantity: reqBody.quantity,
			})
			.exec()
			.then((result) => {
				res.status(201).json({
					code: result,
					message: 'product updated successfully'
				})
			});
	}
	const catchError = (err) => {
		res.status(404).json({
			message: err
		});
	}
}

//** get single product */
const deleteProducts = (req, res, next) => {
	const productId = req.params.id;

	Product.findOne({
			_id: productId
		})
		.exec()
		.then((result) => {
			productQuery(result.id);
		}).catch((err) => {
			catchError(err);
		});

	const productQuery = (d) => {
		console.log(d);
		(!d) ? res.status(404).json({
				message: 'product not found'
			}):
			Product.deleteOne({
				_id: d
			})
			.exec()
			.then(d => {
				res.status(201).json({
					message: 'product deleted'
				});
			});
	}
	const catchError = (err) => {
		res.status(404).json({
			message: err
		});
	}

}

router.get('/', getAllProducts);
router.get('/:id', getSingleProduct);
router.post('/', addProducts);
router.patch('/:id', updateProducts);
router.delete('/:id', deleteProducts);
module.exports = router;
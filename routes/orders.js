const mongoose = require('mongoose');
const express = require('express');
const Order = require('../models/order');
const router = express.Router();



const getAllOrders = (req, res, next) => {

	Order.find()
		.exec()
		.then((result) => {
			orderQuery(result);
		}).catch((err) => {
			catchError(err);
		});

	const orderQuery = (data) => {
		(!data || data == '') ? res.status(404).json({
			message: 'no orders found'
		}): res.status(201).json({
			orders: result,
			message: 'orders successfully fetched'
		})
	}

	const catchError = err => {
		res.status(404).json({
			message: err
		});
	};

}


const getOrder = (req, res, next) => {
	const orderId = req.params.id;
	Order.findOne({
			_id: orderId
		})
		.exec()
		.then((result) => {
			console.log('result ' + result);
			res.status(201).json({
				order: result,
				message: 'get single order'
			})
		}).catch((err) => {
			catchError(err);
		});

	const catchError = err => {
		res.status(404).json({
			message: 'something went wrong',
			err: err
		});
	};

}


const addOrder = (req, res, next) => {
	res.status(201).json({
		message: 'order added successfully'
	})
}


const deleteOrder = (req, res, next) => {
	res.status(201).json({
		message: 'order delete successfully'
	})
}

router.get('/', getAllOrders);
router.get('/:id', getOrder);
router.post('/', addOrder);
router.delete('/:id', deleteOrder);

module.exports = router;
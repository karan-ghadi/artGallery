const mongoose = require('mongoose');
const express = require('express');
const User = require('../models/user');
const Product = require('../models/product');
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


const addOrders = (req, res, next) => {
	const state = req.body;

	const checkUser = (params) => {
		User.findById(state.userId)
		.exec()
		.then((result) => { (!result) ? catchError({ code: 'UNF' }) : checkProduct(state) });
	}

	const checkProduct = (state) => {
		Product.findById(state.productId)
		.exec()
		.then((result) => { (!result) ? catchError({ code: 'PNF' }) : addOrder(state) });
	}

	const addOrder = (state) => {
		const order = new Order({
			_id: new mongoose.Types.ObjectId(),
			trackingId: new mongoose.Types.ObjectId(),
			userId: state.userId,
			productId: state.productId,
			quantity: state.quantity,
			amount: state.amount
		});

		order.save()
		.then((result) => { res.status(201).json({ message: 'order successfully placed', orderId: result._id, trackingId: result.trackingId }) })
		.catch((err) => { res.status(400).json({ message: err}) });
	}

	//** error function */
  const catchError = (err) => {
		const errors = [
			{ code: 'SWW', message: 'something went wrong' },
			{ code: 'UNF', message: 'user not found' },
			{ code: 'PNF', message: 'product not found' }
		];

		errors.filter(error => err.code === error.code).map(error => {
			res.status(500).json({ code: error.code, message: error.message });
		})
	}

	checkUser(state);
}
// product id: 5bcd6e9789c5571b1840521c
// user id: 5bbc88a2edd5362b4453a10d

const deleteOrder = (req, res, next) => {
	res.status(201).json({
		message: 'order delete successfully'
	})
}

router.get('/', getAllOrders);
router.get('/:id', getOrder);
router.post('/', addOrders);
router.delete('/:id', deleteOrder);

module.exports = router;
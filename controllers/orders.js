const mongoose = require('mongoose');
const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');


// <==Function to fetch all orders
exports.getAllOrders = (req, res, next) => {

	const getOrders = () => {
		Order.find()
		.select('_id tracking quantity name amount')
		.populate('user','username')
		.populate('product', 'name')
		.exec()
		.then((result) => {
			(result.length <= 0) ? catchError({ code: 'NF' }) : res.status(200).json({
				count: result.length,
				orders: result
			});
		})
		.catch((err) => { res.status(500).json({ error: err }); });
	}

	//** error function */
	const catchError = (err) => {
		const errors = [
			{ code: 'SWW', message: 'something went wrong' },
			{ code: 'NF', message: 'orders not found' }
		];

		errors.filter(error => err.code === error.code).map(error => {
			res.status(500).json({ code: error.code, message: error.message });
		})
	}

	getOrders();
}
// Function to fetch all orders==>

// <==Function to fetch single orders
exports.getSingleOrder = (req, res, next) => {
	const state = req.params

	const checkOrder = (state) => {
		Order.findById(state.id)
		.select('_id tracking quantity name amount')
		.populate('user','username')
		.populate('product', 'name')
		.exec()
		.then((result) => {
			(!result) ? catchError({ code: 'NF' }) : res.status(200).json({
				message: result
			});
		})
		.catch((err) => {
			console.log(err)
			res.status(500).json({ error: err });
		});
	}

	//** error function */
	const catchError = (err) => {
		const errors = [
			{ code: 'SWW', message: 'something went wrong' },
			{ code: 'NF', message: 'order not found' }
		];

		errors.filter(error => err.code === error.code).map(error => {
			res.status(500).json({ code: error.code, message: error.message });
		})
	}

	checkOrder(state);
}
// Function to fetch single orders==>

// <==Function to add single orders
exports.addSingleOrder = (req, res, next) => {
	const state = req.body;

	const checkUser = (state) => {

		User.findOne({ _id :state.user })
		.exec()
		.then((user) => { (!user) ? catchError({ code: 'UNF' }) : checkProduct(state) });
	}

	const checkProduct = (state) => {
		Product.findOne({ _id: state.product })
		.exec()
		.then((product) => { (!product) ? catchError({ code: 'PNF' }) : addOrder(state) });
	}

	const addOrder = (state) => {
		const order = new Order({
			_id: new mongoose.Types.ObjectId(),
			tracking: new mongoose.Types.ObjectId(),
			user: state.user,
			product: state.product,
			quantity: state.quantity,
			amount: state.amount
		});
		order.save()
		.then((result) => { res.status(201).json({ message: 'order successfully placed', orderId: result._id, tracking: result.tracking }) })
		.catch((err) => { res.status(500).json({ error: err}) });
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
// Function to add single orders==>

// <==Function to update single orders
exports.updateOrder = (req, res, next) => {
	const orderId = req.params.id;
  const state = req.body;

  const findProduct = (state) => {
    Order.findById(orderId)
    .exec()
		.then((result) => {
			(result) ? checkValidation(state) : catchError({ code: 'NF' })
		})
  }

  const checkValidation = (state) => {
    (!state.quantity || !state.amount ) ? catchError({ code: 'MII' }) : updateOrder(state)
  }

  const updateOrder = (state) => {
    Order.findByIdAndUpdate(orderId , {
      quantity: state.quantity,
			amount: state.amount
    })
    .exec()
		.then((result) => {
			res.status(201).json({ message: 'Order updated successfully'})
		})
    .catch((err) => { res.status(500).json({ message: err }) });

  }
  //** error function */
  const catchError = (err) => {
    const errors = [
      { code: 'SWW' , message: 'something went wrong' },
      { code: 'MII' , message: 'missing important information' },
      { code: 'AE' , message: 'product already exists' },
      { code: 'NF' , message: 'product not found' },
    ];

    errors.filter(error => err.code === error.code).map(error => {
      res.status(500).json({
        code: error.code,
        message: error.message
      });
    });
  }

  findProduct(state);
}
// Function to update single orders==>

// <==Function to delete single orders
exports.deleteOrder = (req, res, next) => {
	const state = req.params

	const checkOrder = (state) => {
		Order.findByIdAndDelete(state.id)
		.exec()
		.then((result) => {
				(!result) ? catchError({ code : 'NF'}) : res.status(200).json({ message: 'Your order has been deleted' });
		})
		.catch((err) => { res.status(500).json({ error: err }); });
	}

	//** error function */
	const catchError = (err) => {
		const errors = [
			{ code: 'SWW', message: 'something went wrong' },
			{ code: 'NF', message: 'order not found' }
		];

		errors.filter(error => err.code === error.code).map(error => {
			res.status(500).json({ code: error.code, message: error.message });
		})
	}

	checkOrder(state)
}
// Function to delete single orders==>
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userid: String,
	productid: String,
	quantity: {
		type: String,
		required: true,
		default: '1'
	},
	amount: String
}, {
	timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	tracking : { type: mongoose.Schema.Types.ObjectId, ref: 'Tracking' },
	product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
	quantity: { type: String, required: true, default: '1' },
	amount: { type: Number, required: true }
}, {
	timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
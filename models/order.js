const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
	trackingId : { type: mongoose.Schema.Types.ObjectId, ref: 'Tracking' },
	quantity: { type: String, required: true, default: '1' },
	amount: { type: Number, required: true }
}, {
	timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
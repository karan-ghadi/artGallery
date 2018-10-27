const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	user: { type: mongoose.Schema.Types.ObjectId, required: true, ref:'User' },
	name: { type: String, required: true},
	productImage: { type: String, required: true},
	description: { type: String },
	price: { type: String, required: true },
	quantity: { type: String, required: true }
}, {
	timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
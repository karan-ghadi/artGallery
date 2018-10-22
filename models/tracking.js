const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
}, {
	timestamps: true
});

module.exports = mongoose.model('Tracking', trackingSchema);
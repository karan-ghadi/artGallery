const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
	username: {
		type: String,
		unique: true,
		required: true,
		lowercase: true
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
		lowercase: true
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('User', userSchema);
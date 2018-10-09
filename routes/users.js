const mongoose = require('mongoose');
const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Get all users
router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'get all users'
	})
});

// Get single user
router.get('/:userid', (req, res, next) => {
	const id = req.params.userid;
	res.status(200).json({
		userData: id,
		message: 'get all users'
	})
});

// Add an user
router.post('/', (req, res, next) => {
	const data = req.body;
	const user = new User({
		_id: new mongoose.Types.ObjectId(),
		firstname: data.firstname,
		lastname: data.lastname,
		username: data.username,
		password: data.password,
		email: data.email
	});

	User.findOne({
			username: data.username
		})
		.exec()
		.then(data => {
			if (data) {
				res.status(200).json({
					user: user,
					message: 'username already exits'
				})
			} else {
				user.save().then(sucess => {
					res.status(200).json({
						user: user,
						message: 'user successfully added'
					})
				})
			}
		});
});

// Delete user
router.delete('/:userid', (req, res, next) => {
	const id = req.params.userid;
	res.status(200).json({
		userData: id,
		message: 'user deleted'
	})
});

// Update user
router.patch('/:userid', (req, res, next) => {
	const id = req.params.userid;
	res.status(200).json({
		userData: id,
		message: 'user updated'
	})
});

module.exports = router;
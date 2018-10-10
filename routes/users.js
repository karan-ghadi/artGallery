const mongoose = require('mongoose');
const express = require('express');
const User = require('../models/user');
const router = express.Router();

//** error function */
const getError = (e) => {
	res.status(404).json({
		message: e,
	});
}

//** get all users */
const getAllUsers = (req, res, next) => {

	User.find().exec().then((result) => {
		onGetUser(result);
	}).catch((err) => {
		getError(err);
	});

	const onGetUser = (d) => {
		(!d) ? res.status(404).json({
			message: 'No user data'
		}): res.status(200).json({
			message: 'Get All Uers',
			users: d
		})
	}
}

//**  get single user */
const getOneUser = (req, res, next) => {
	const uname = req.params.username;
	User.findOne({
		username: uname
	}).exec().then(result => {
		onGetUser(result);
	}).catch((err) => {
		getError(err);
	});

	const onGetUser = (d) => {
		(!d) ? res.status(200).json({
			message: 'user not found'
		}): res.status(200).json({
			userData: d,
			message: 'get single user'
		});
	}

}

//**  add an user */
const addUser = (req, res, next) => {
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
		.then(result => {
			onAddUser(result);
		}).catch((err) => {
			getError(err);
		});

	const onAddUser = (d) => {
		(d) ? res.status(200).json({
			user: user,
			message: 'username already exits'
		}): user.save().then(sucess => {
			res.status(200).json({
				user: sucess,
				message: 'user successfully added'
			});
		});
	}
}

//**  delete an user */
const deleteUser = (req, res, next) => {
	const uname = req.params.username;

	User.findOne({
			username: uname
		})
		.exec()
		.then(result => {
			onDeletUser(result)
		}).catch((err) => {
			getError(err);
		});

	const onDeletUser = (d) => {
		(!d) ? res.status(200).json({
				message: 'user not found'
			}):
			User.deleteOne({
				username: uname
			})
			.exec()
			.then(d => {
				res.status(200).json({
					message: 'user deleted'
				});
			});
	}
}


//**  update an user */
const updateUser = (req, res, next) => {
	const uname = req.params.username;
	User.findOne({
			username: uname
		})
		.exec()
		.then(result => {
			onUpdateUser(result)
		}).catch((err) => {
			getError(err);
		});

	const onUpdateUser = (d) => {
		(!d) ? res.status(200).json({
				message: 'user not found'
			}): User.updateOne({
				username: uname
			}, {
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				password: req.body.password
			})
			.exec()
			.then(d => {
				res.status(200).json({
					message: 'user details updated'
				});
			});
	}
}


//**  API ENDPOINTS */

router.get('/', getAllUsers);
router.get('/:username', getOneUser);
router.post('/', addUser);
router.delete('/:username', deleteUser);
router.patch('/:username', updateUser);


module.exports = router;
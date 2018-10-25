const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();
const secretKey = 'PubG';


const authenticateUser = (req, res, next) => {
	const state = req.body;
	console.log(state);
	const checkValidation = (state) => {
		(!state.email || !state.password) ? catchError({ code: 'MII' }) : checkEmail(state)
	}
	const checkEmail = (state) => {
		User.findOne({ email: state.email })
		.exec()
			.then((user) => {

			if (!user) { catchError({ code: 'AF' }) }
			else {
				bcrypt.compare(state.password, user.password, (err, result) => {
					if (err) {
						res.status(500).json({
							message: 'auth failed'
						});
					}
					if (result) {
						const token = jwt.sign({
							email: user.email,
							username: user.username
						}, secretKey, {
							expiresIn: '1h'
						})
						res.status(500).json({
							message: 'Auth Successfull',
							token: token
						});
					}
				});
			}
		})
		.catch((err) => {
			res.status(500).json({
				message:err
			});
		});
	}

	//** error function */
  const catchError = (err) => {
    const errors = [
      { code: 'SWW' , message: 'something went wrong' },
      { code: 'MII' , message: 'missing important information' },
      { code: 'AF' , message: 'auth failed' },
    ];

    errors.filter(error => err.code === error.code).map(error => {
      res.status(500).json({
        code: error.code,
        message: error.message
      });
    });
  }

	checkValidation(state);
}

//**  API ENDPOINTS */
router.post('/login', authenticateUser);

module.exports = router;


const mongoose = require('mongoose');
const express = require('express');
const User = require('../models/user');
const router = express.Router();

//** get all users */
const getAllUsers = (req, res, next) => {
  User.find()
    .exec()
    .then(result => {
      getUserData(result);
    })
    .catch(err => {
      catchError(err);
    });

  const getUserData = data => {
    data == '' || !data
      ? res.status(404).json({
          message: 'No users data found'
        })
      : res.status(200).json({
          message: 'users successfully fetched',
          users: data
        });
  };

  //** error function */
  const catchError = err => {
    res.status(404).json({
      message: 'something went wrong',
      err: err
    });
  };
};

//**  get single user */
const getOneUser = (req, res, next) => {
  const uname = req.params.username;

  User.findOne({
    username: uname
  })
    .exec()
    .then(result => {
      getUserData(result);
    })
    .catch(err => {
      catchError(err);
    });

  const getUserData = data => {
    !data
      ? res.status(200).json({
          message: 'user not found'
        })
      : res.status(200).json({
          message: 'User Details',
          userData: data
        });
  };

  //** error function */
  const catchError = err => {
    res.status(404).json({
      message: 'something went wrong',
      err: err
    });
  };
};

//**  add an user */
const addUser = (req, res, next) => {
  const state = req.body;

  const checkValidation = state => {
    (!state.firstname || !state.lastname || !state.username || !state.password || !state.email) ? catchError({ code: 'MII' }) : checkUser(state);
  };

  const checkUser = state => {
    User.findOne({ $or: [{ email: state.email },{ username: state.username }] })
      .exec()
			.then(result => {
				result ? ((result.email === state.email) ? catchError({code:'EE'}) : catchError({code:'UE'}) ) : addUserData(state)
			})
      .catch(err =>  catchError({ code: 'SWW' }) );
  };

  const addUserData = state => {
		const user = new User({
			_id: new mongoose.Types.ObjectId(), firstname: state.firstname, lastname: state.lastname, username: state.username, password: state.password, email: state.email
    });

    user
      .save()
      .then(result => res.status(200).json({ user: result, message: 'user successfully added' }) )
			.catch(err => catchError({ code: 'SWW' }))
  };

  //** error function */
  const catchError = err => {
    const errors = [
      { code: 'SWW', message: 'Something went wrong' },
      { code: 'MII', message: 'Missing important information' },
			{ code: 'EE', message: 'email already exist' },
			{ code: 'UE', message: 'username already exist' }
    ];

    errors.filter(error => err.code === error.code).map(error => {
      res.status(200).json({
        code: error.code,
        message: error.message
      });
    });
  };

  checkValidation(state);
};

//**  delete an user */
const deleteUser = (req, res, next) => {
  const uname = req.params.username;

  User.findOne({
    username: uname
  })
    .exec()
    .then(result => {
      deletUserData(result);
    })
    .catch(err => {
      catchError(err);
    });

  const deletUserData = d => {
    !d
      ? res.status(200).json({
          message: 'user not found'
        })
      : User.deleteOne({
          username: uname
        })
          .exec()
          .then(d => {
            res.status(200).json({
              message: 'user deleted'
            });
          });
  };

  //** error function */
  const catchError = e => {
    res.status(404).json({
      message: 'something went wrong',
      err: err
    });
  };
};

//**  update an user */
const updateUser = (req, res, next) => {
  const uname = req.params.username;
  User.findOne({
    username: uname
  })
    .exec()
    .then(result => {
      updateUserData(result);
    })
    .catch(err => {
      catchError(err);
    });

  const updateUserData = d => {
    !d
      ? res.status(200).json({
          message: 'user not found'
        })
      : User.updateOne(
          {
            username: uname
          },
          {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password
          }
        )
          .exec()
          .then(d => {
            res.status(200).json({
              message: 'user details updated'
            });
          });
  };

  //** error function */
  const catchError = e => {
    res.status(404).json({
      message: 'something went wrong',
      err: err
    });
  };
};

//**  API ENDPOINTS */

router.get('/', getAllUsers);
router.get('/:username', getOneUser);
router.post('/', addUser);
router.delete('/:username', deleteUser);
router.patch('/:username', updateUser);

module.exports = router;

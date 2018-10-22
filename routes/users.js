const mongoose = require('mongoose');
const express = require('express');
const User = require('../models/user');
const router = express.Router();

//** get all users */
const getAllUsers = (req, res, next) => {

  const getUser = () => {
    User.find()
    .exec()
    .then((result) => {
      (result.length <= 0) ? catchError({ code: 'NF' }) : res.status(200).json({ message: 'user found', user: result })
    })
    .catch((err) =>  catchError({ code : 'SWW' }) );
  }

  //** error function */
  const catchError = err => {
    const errors = [
      { code: 'SWW', message: 'something went wrong' },
      { code: 'NF', message: 'no user found' }
    ];
    errors.filter(error => err.code === error.code).map(error => {
      res.status(500).json({ code: error.code, message: error.message });
    });
  };

  getUser();
};
//**  get single user */
const getOneUser = (req, res, next) => {
  const state = req.params;

  const checkValidation = (state) => {
    (!state.username) ? catchError({ code: 'MII' }) : findUser(state)
  }

  const findUser = (state) => {
    User.findOne({ username: state.username })
      .select('firstname lastname username email')
      .exec()
      .then((result) => { (!result) ? catchError({ code: 'UNF' }) : res.status(200).json({ message: 'user found', user: result }) })
      .catch((err) =>  catchError({ code: 'SWW' })  );
  }

  //** error function */
  const catchError = (err) => {
    const errors = [
      { code: 'SWW', message: 'something went wrong' },
      { code: 'UNF', message: 'user not found' },
      { code: 'MII', messgae: 'missing important information' }
    ]
    errors.filter(error => err.code === error.code).map(error => {
      res.status(500).json({ code: error.code, message: error.message });
    })
  };

  checkValidation(state)
};

//**  add an user */
const addUser = (req, res, next) => {
  const state = req.body;

  const checkValidation = (state) => {
    (!state.firstname || !state.lastname || !state.username || !state.password || !state.email) ? catchError({ code: 'MII' }) : checkUser(state);
  };

  const checkUser = (state) => {
    User.findOne({ $or: [{ email: state.email },{ username: state.username }] })
      .exec()
			.then((result) => { result ? ((result.email === state.email) ? catchError({code:'EE'}) : catchError({code:'UE'}) ) : addUserData(state)})
      .catch(err =>  catchError({ code: 'SWW' }) );
  };

  const addUserData = (state) => {
		const user = new User({
      _id: new mongoose.Types.ObjectId(),
      firstname: state.firstname,
      lastname: state.lastname,
      username: state.username,
      password: state.password,
      email: state.email
    });

    user
      .save()
      .then((result) => res.status(200).json({ user: result, message: 'user successfully added' }) )
			.catch((err) => catchError({ code: 'SWW' }))
  };

  //** error function */
  const catchError = (err) => {
    const errors = [
      { code: 'SWW', message: 'something went wrong' },
      { code: 'MII', message: 'missing important information' },
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
  const state = req.params;

  const checkValidation = (state) => {
    (!state) ? catchError({ code: 'MII' }) : findUser(state)
  }

  const findUser = (state) => {
    User.findOne({ username: state.username })
      .exec()
      .then((result) =>  (!result) ? catchError({ code: 'UNF' }) : deleteUser(state) )
      .catch((err) => catchError({ code: 'SWW' }) );

  };

  const deleteUser = (state) => {
    User.deleteOne({ username: state.username })
      .exec()
      .then((result) => res.status(200).json({ message: 'user deleted', user: result }))
      .catch((err) => catchError({ code: 'SWW' }));
  }

  //** error function */
  const catchError = (err) => {
    const errors = [
      { code: 'SWW', message: 'something went wrong' },
      { code: 'MII', message: 'missing important information' },
      { code: 'UNF', message: 'user not found' }
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

//**  update an user */
const updateUser = (req, res, next) => {
  const state = req.params;

  const checkUser = (state) => {
    User.findOne({ username: state.username })
      .exec()
      .then((result) =>  (!result) ? catchError({ code: 'UNF' }) : updateUser(state) )
      .catch((err) =>  catchError({ code: 'SWW' }) );

  };

  const updateUser = (state) => {
    User.updateOne({ username: state.username }, { firstname: req.body.firstname, lastname: req.body.lastname, password: req.body.password })
      .exec()
      .then(result => { res.status(200).json({ message: 'user details updated' }) });
  };

  //** error function */
  const catchError = (err) => {
    console.log(err)
    const errors = [
      { code: 'SWW', message: 'something went wrong' },
      { code: 'MII', message: 'missing important information' },
      { code: 'UNF', message: 'user not found' }
    ];

    errors.filter(error => err.code === error.code).map(error => {
      res.status(200).json({
        code: error.code,
        message: error.message
      });
    });
  };

  checkUser(state);
};

//**  API ENDPOINTS */
router.get('/', getAllUsers);
router.get('/:username', getOneUser);
router.post('/', addUser);
router.delete('/:username', deleteUser);
router.patch('/:username', updateUser);

module.exports = router;
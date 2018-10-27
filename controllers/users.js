const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// <==function to fetch all users
exports.getAllUsers = (req, res, next) => {

  const getUser = () => {
    User.find()
    .exec()
    .then((result) => {
      (result.length <= 0) ? catchError({ code: 'NF' }) : res.status(200).json({ count: result.length, user: result })
    })
    .catch((err) =>  catchError({ code : 'SWW' }) );
  }

  //** error function */
  const catchError = err => {
    const errors = [
      { code: 'SWW', message: 'something went wrong' },
      { code: 'UNF', message: 'user not found' }
    ];
    errors.filter(error => err.code === error.code).map(error => {
      res.status(500).json({ code: error.code, message: error.message });
    });
  };

  getUser();
};
// function to fetch all users==>

// <==function to fetch single users
exports.getSingleUser = (req, res, next) => {
  const state = req.params;

  const checkValidation = (state) => {
    (!state.username) ? catchError({ code: 'MII' }) : findUser(state)
  }

  const findUser = (state) => {
    User.findOne({ username: state.username })
      .select('firstname lastname username email')
      .exec()
      .then((result) => { (!result) ? catchError({ code: 'UNF' }) : res.status(200).json({ user: result }) })
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
// function to fetch single users==>

// <==function to add single users
exports.addSingleUser = (req, res, next) => {
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
    bcrypt.hash(state.password, 10, function(err, hash) {
      if (err) {
        res.status(200).json({  err: err })
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          firstname: state.firstname,
          lastname: state.lastname,
          username: state.username,
          password: hash,
          email: state.email
        });

        user
          .save()
          .then((result) => res.status(200).json({ user: result, message: 'user successfully added' }) )
          .catch((err) => catchError({ code: 'SWW' }))
      }
    });
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
      res.status(500).json({
        code: error.code,
        message: error.message
      });
    });
  };

  checkValidation(state);
};
// function to add single users==>

// <==function to update single users
exports.updateUser = (req, res, next) => {
  const state = req.params;

  const checkUser = (state) => {
    User.findOne({ username: state.username })
      .exec()
      .then((result) =>  (!result) ? catchError({ code: 'UNF' }) : updateUser(state) )
      .catch((err) =>  catchError({ code: 'SWW' }) );

  };

  const updateUser = (state) => {
    User.findOneAndUpdate( { username: state.username } , { firstname: req.body.firstname, lastname: req.body.lastname})
      .exec()
      .then(result => { res.status(200).json({ message: 'user details updated' , user: result}) });
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
      res.status(500).json({
        code: error.code,
        message: error.message
      });
    });
  };

  checkUser(state);
};
// function to update single users==>

// <==function to delete single users
exports.deleteUser = (req, res, next) => {
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
    User.findOneAndDelete({ username: state.username })
      .exec()
      .then((result) => res.status(200).json({ message: 'user deleted' }))
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
      res.status(500).json({
        code: error.code,
        message: error.message
      });
    });
  };

  checkValidation(state);
};
// function to add delete users==>
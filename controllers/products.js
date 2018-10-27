const mongoose = require('mongoose');
const Product = require('../models/product');
const User = require('../models/user');

// <==Function to fetch all products
exports.getAllProducts = (req, res, next) => {

  const getProducts = () => {
    Product.find()
		.select('name productImage description price quantity user')
		.populate('user','username')
    .exec()
      .then((result) => {
        (!result.length) ? catchError({ code: 'PNF' }) : res.status(200).json({
          count: result.length,
          products: result.map(result => {
            return { id: result._id, name: result.name, productImage: result.productImage, description: result.description, price: result.price, quantity: result.quantity
            }
          })
        })
      })
    .catch((err) =>  catchError({ code: 'SWW' }) );
  }

  //** error function */
  const catchError = (err) => {
    const errors = [
      { code: 'SWW' , message: 'something went wrong' },
      { code: 'PNF' , message: 'products not found' },
    ];

    errors.filter(error => err.code === error.code).map(error => {
      res.status(500).json({
        code: error.code,
        message: error.message
      });
    });
  }

  getProducts();
};
// Function to fetch all products==>

// <==Function to fetch single products
exports.getSingleProduct = (req, res, next) => {
  const state = req.params;

  const findProduct = (state) => {
    Product.findById(state.id)
    .select('name productImage description price quantity')
    .populate('user','username')
    .exec()
    .then((result) => { (!result) ? catchError({ code: 'NF' }) : getProduct(result) })
    .catch((err) =>  catchError({ code: 'SWW' }) );
  }

  const getProduct = (state) => {
    res.status(200).json({ product: state });
  }

  //** error function */
  const catchError = (err) => {
    const errors = [
      { code: 'SWW' , message: 'something went wrong' },
      { code: 'PNF' , message: 'products not found' },
    ];

    errors.filter(error => err.code === error.code).map(error => {
      res.status(500).json({
        code: error.code,
        message: error.message
      });
    });
  }

  findProduct(state);
};
// Function to fetch single products==>

// <==Function to add single products
exports.addSingleProduct = (req, res, next) => {
  const state = req.body;
  const checkValidation = (state) => {
    (!state.name || !state.description || !state.price || !state.quantity || !state.user) ? catchError({ code: 'MII' }) : checkProduct(state)
  }

  const checkProduct = (state) => {
    Product.findOne({ name: state.name })
    .exec()
    .then((result) => { (result) ? catchError({ code: 'PAE'}) : addProduct(state); });
  }

  const addProduct = (state) => {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      user: state.user,
      name: state.name,
      description: state.description,
      price: state.price,
      quantity: state.quantity,
      productImage: req.file.path
    })

    product.save()
    .then((result) => { res.status(201).json({ message: result }) })
    .catch((err) => { catchError({ code: 'SWW' }) });

  }

  //** error function */
  const catchError = (err) => {
    const errors = [
      { code: 'SWW' , message: 'something went wrong' },
      { code: 'MII' , message: 'missing important information' },
      { code: 'PAE' , message: 'product alredy exists' },
    ];

    errors.filter(error => err.code === error.code).map(error => {
      res.status(500).json({
        code: error.code,
        message: error.message
      });
    });
  }

  checkValidation(state);
};
// Function to add single products==>

// <==Function to update single products
exports.updateProduct = (req, res, next) => {
  const productId = req.params.id;
  const state = req.body;

  const findProduct = (state) => {
    Product.findById(productId)
    .exec()
    .then((result) => {
        (result) ? checkValidation(state) : catchError({code: 'PNF'})
    })
  }

  const checkValidation = (state) => {
    (!state.name || !state.description || !state.price || !state.quantity) ? catchError({ code: 'MII' }) : updateProduct(state)
  }

  const updateProduct = (state) => {
    Product.findByIdAndUpdate(productId , {
      name: state.name,
      description: state.description,
      price: state.price,
      quantity: state.quantity
    })
    .exec()
    .then((result) => { res.status(201).json({ message: 'product updated successfully' }) })
    .catch((err) => { res.status(500).json({ message: err }) });

  }
  //** error function */
  const catchError = (err) => {
    const errors = [
      { code: 'SWW' , message: 'something went wrong' },
      { code: 'MII' , message: 'missing important information' },
      { code: 'PNF' , message: 'product not found' },
    ];

    errors.filter(error => err.code === error.code).map(error => {
      res.status(500).json({
        code: error.code,
        message: error.message
      });
    });
  }

  findProduct(state);
};
// Function to update single products==>


// <==Function to delete single products
exports.deleteProducts = (req, res, next) => {
  const productId = req.params.id;
  const state = req.body;

  const findProduct = (state) => {
    Product.findById(productId)
    .exec()
    .then((result) => {
        (result) ? deleteProduct(state) : catchError({code: 'PNF'})
    })
  }

  const deleteProduct = (state) => {
    Product.findByIdAndDelete(productId)
    .exec()
    .then((result) => { res.status(201).json({ message: 'product deleted successfully' }) })
    .catch((err) => { res.status(500).json({ message: err }) });

  }

  //** error function */
  const catchError = (err) => {
    const errors = [
      { code: 'SWW' , message: 'something went wrong' },
      { code: 'MII' , message: 'missing important information' },
      { code: 'PNF' , message: 'product not found' },
    ];

    errors.filter(error => err.code === error.code).map(error => {
      res.status(500).json({
        code: error.code,
        message: error.message
      });
    });
  }
  findProduct(state);
};
// Function to delete single products==>

// <==Function to delete single products
exports.getUserProduct = (req, res, next) => {
  const state = {
    reqBody: req.body,
    reqParam: req.params
  }

  const checkUser = (state) => {
    User.findById(state.reqParam.id)
    .exec()
    .then((result) => { (!result) ? catchError({code: 'UNF'}) : getAllProduct(state) })
    .catch((err) => { res.status(500).json({ message: err }) });
  }

  const getAllProduct = (state) => {
    Product.find()
    .select('name description price quantity productImage')
    .where('user').equals(state.reqParam.id)
    .exec()
    .then((result) => { (!result.length > 0) ? catchError({ code: 'PNF' }) : res.status(200).json({ product: result }) })
    .catch((err) => { catchError({ code: 'SWW' }) });
  }
  //** error function */
  const catchError = (err) => {
    const errors = [
      { code: 'SWW' , message: 'something went wrong' },
      { code: 'MII' , message: 'missing important information' },
      { code: 'UNF' , message: 'user not found' },
      { code: 'PNF' , message: 'product not found' }
    ];

    errors.filter(error => err.code === error.code).map(error => {
      res.status(500).json({
        code: error.code,
        message: error.message
      });
    });
  }
  checkUser(state)
}
// Function to delete single products==>
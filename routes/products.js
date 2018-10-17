const mongoose = require('mongoose');
const express = require('express');
const Product = require('../models/product');
const router = express.Router();

const getAllProducts = (req, res, next) => {

  const getProducts = () => {
    Product.find()
    .exec()
    .then((result) =>  (!result.length) ? catchError({ code: 'NF' }) : res.status(200).json({ products : result }) )
    .catch((err) =>  catchError({ code: 'SWW' }) );
  }

  //** error function */
  const catchError = (err) => {
    const errors = [
      { code: 'SWW' , message: 'something went wrong' },
      { code: 'NF' , message: 'products not found' },
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

//** get single product */
const getSingleProduct = (req, res, next) => {
  const state = req.params;

  const findProduct = (state) => {
    Product.findById(state.id)
    .exec()
    .then((result) => { (!result) ? catchError({ code: 'NF' }) : getProduct(result) })
    .catch((err) =>  catchError({ code: 'SWW' }) );
  }

  const getProduct = (state) => {
    res.status(200).json({ message: 'Product Found', product: state });
  }

  //** error function */
  const catchError = (err) => {
    const errors = [
      { code: 'SWW' , message: 'something went wrong' },
      { code: 'NF' , message: 'products not found' },
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

//** add single product */

const addProducts = (req, res, next) => {
  const state = req.body;

  const checkValidation = (state) => {
    (!state.name || !state.description || !state.price || !state.quantity) ? catchError({ code: 'MII' }) : checkProduct(state)
  }

  const checkProduct = (state) => {
    Product.findOne({ name: state.name })
    .exec()
    .then((result) => { (result) ? catchError({ code: 'AE'}) : addProduct(state); });
  }

  const addProduct = (state) => {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: state.name,
      description: state.description,
      price: state.price,
      quantity: state.quantity
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
      { code: 'AE' , message: 'product alredy exists' },
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

//** update product */
const updateProducts = (req, res, next) => {
  const productId = req.params.id;
  const reqBody = req.body;
  Product.findOne({
    _id: productId
  })
    .exec()
    .then(result => {
      productQuery(result);
    })
    .catch(err => {
      catchError(err);
    });

  const productQuery = data => {
    Product.updateOne({
      _id: data
    }, {
        name: reqBody.name,
        description: reqBody.description,
        price: reqBody.price,
        quantity: reqBody.quantity
      })
      .exec()
      .then(result => {
        res.status(201).json({
          code: result,
          message: 'product updated successfully'
        });
      });
  };
  const catchError = err => {
    res.status(404).json({
      message: err
    });
  };
};

//** delete single product */
const deleteProducts = (req, res, next) => {
  const productId = req.params.id;

  Product.findOne({
    _id: productId
  })
    .exec()
    .then(result => {
      productQuery(result.id);
    })
    .catch(err => {
      catchError(err);
    });

  const productQuery = data => {
    (!data) ? res.status(404).json({
      message: 'product not found'
    }) : Product.deleteOne({
      _id: d
    })
      .exec()
      .then(d => {
        res.status(201).json({
          message: 'product deleted'
        });
      });
  };
  const catchError = err => {
    res.status(404).json({
      message: err
    });
  };
};


router.get('/', getAllProducts);
router.get('/:id', getSingleProduct);
router.post('/', addProducts);
router.patch('/:id', updateProducts);
router.delete('/:id', deleteProducts);


module.exports = router;
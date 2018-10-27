const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');
const dates = new Date();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, dates.toLocaleString().replace(/:/g, '-') + '-' + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    // To accept the file pass `true`, like so:
    cb(null, true);
  } else {
    // To reject this file pass `false`, like so:
    cb(null, false);
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter
});

// const upload = multer({ dest: 'uploads/' });


const getAllProducts = (req, res, next) => {

  const getProducts = () => {
    Product.find()
    .select('name productImage description price quantity')
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

//** get single product */
const getSingleProduct = (req, res, next) => {
  const state = req.params;

  const findProduct = (state) => {
    Product.findById(state.id)
    .select('name productIMage description price quantity')
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

//** add single product */

const addProducts = (req, res, next) => {
  const state = req.body;
  console.log(req.file);
  const checkValidation = (state) => {
    (!state.name || !state.description || !state.price || !state.quantity) ? catchError({ code: 'MII' }) : checkProduct(state)
  }

  const checkProduct = (state) => {
    Product.findOne({ name: state.name })
    .exec()
    .then((result) => { (result) ? catchError({ code: 'PAE'}) : addProduct(state); });
  }

  const addProduct = (state) => {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
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

//** update product */
const updateProducts = (req, res, next) => {
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

//** delete single product */
const deleteProducts = (req, res, next) => {
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


router.get('/', getAllProducts);
router.get('/:id', getSingleProduct);
router.post('/', checkAuth, upload.single('productImage'), addProducts);
router.patch('/:id', checkAuth, updateProducts);
router.delete('/:id', checkAuth, deleteProducts);


module.exports = router;
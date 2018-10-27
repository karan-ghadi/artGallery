const express = require('express');
const multer = require('multer');
const router = express.Router();
const productsController = require('../controllers/products');
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

// Order Routes
router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getSingleProduct);
router.get('/users/:id', productsController.getUserProduct);
router.post('/', checkAuth, upload.single('productImage'), productsController.addSingleProduct);
router.patch('/:id', checkAuth, productsController.updateProduct);
router.delete('/:id', checkAuth, productsController.deleteProducts);

module.exports = router;
// Note: All the funtions are written in contollers folder
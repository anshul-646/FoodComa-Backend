const express = require('express');
const multer = require('multer');
const { addProduct, getProduct, deleteProduct } = require('../controllers/productController');
const { isLoggedIn, isAdmin } = require('../validation/authValidator');
const uploader = require('../Middlewares/multerMidlleware');

const productRouter = express.Router();

// Multer setup (temporary storage)
const storage = multer.diskStorage({});
const upload = multer({ storage });

productRouter.post('/',isLoggedIn,isAdmin, uploader.single('productImage'), addProduct);
productRouter.get('/:id',getProduct);
productRouter.delete('/:id',deleteProduct);

module.exports = productRouter;

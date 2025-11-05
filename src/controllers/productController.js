const fs = require('fs/promises');
const { getProductById, deleteProductById } = require('../repositories/productRepository');
const { createProduct } = require('../service/productService');
const AppError = require('../utils/appError');

async function addProduct(req, res) {
  try {

    if (!req.body.productName || !req.body.price) {
      throw new AppError('Product name and price are required', 400);
    }

    const productData = {
      productName: req.body.productName,
      description: req.body.description,
      imagePath: req.file ? req.file.path : null, // Local path for Cloudinary upload
      quantity: req.body.quantity,
      price: req.body.price,
      category: req.body.category,
      inStock: req.body.inStock,
    };
    const product = await createProduct(productData);

    return res.status(201).json({
      success: true,
      message: 'product created successfully',
      data: product,
    });
  } catch (error) {
    // Clean up uploaded file if something fails before Cloudinary upload
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupErr) {
        console.error('Error cleaning up temp image:', cleanupErr);
      }
    }

    // Handle known application errors
    if(error instanceof AppError){
      return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    }

    // Unknown or server error
    console.error('Error creating product:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while creating product',
    });
  }
}

async function getProduct(req,res){
  try {
    const product = await getProductById(req.params.id);

    return res.status(200).json({
      success:true,
      message:'Product fetched successfully',
      error : {},
      data: product
    });
  } catch (error) {
    if(error instanceof AppError){
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error fetching product:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching product',
    });
  }
}

async function deleteProduct(req,res){
  try {
    const deletedProduct  = await deleteProductById(req.params.id);
    return res.status(200).json({
      success:true,
      message:'Product deleted successfully',
      error : {},
      data: deletedProduct 
    });
  } catch (error) {
    if(error instanceof AppError){
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    
    console.error('Error deleting product:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while deleting product',
    });
  }
}
module.exports = {
  addProduct,
  getProduct,
  deleteProduct
};

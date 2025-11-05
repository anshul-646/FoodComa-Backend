const fs = require('fs/promises');
const cloudinary = require('../config/cloudinaryConfig')
const ProductRepository = require('../repositories/productRepository');
const InternalServerError = require('../utils/internalServerError');
const NotFoundError = require('../utils/notFoundError');

async function createProduct(productDetails) {
    const { imagePath, ...otherDetails } = productDetails;
    let productImage = null;
    // 1. We should check if an image is coming to create the product,then we should first upload it to clodinary
    
    if(imagePath){
        try {
            const cloudinaryResponse = await cloudinary.uploader.upload(
                imagePath,
                 {folder: 'products',}
            );
            productImage = cloudinaryResponse.secure_url;

            // Clean up local file after successful upload
            await fs.unlink(imagePath);
        } catch (error) {
            console.error('Cloudinary upload failed:', error);

            // Attempt to remove local file even if upload fails
            try {
                await fs.unlink(imagePath);
            } catch (cleanupError) {
                console.error('Failed to clean up local file after Cloudinary error:', cleanupError);
            }
            throw new InternalServerError('Failed to upload image');
        }
    }
    // 2. Then use the url from cloudinary and other details to store it to mongodb
    try {
        const product = await ProductRepository.createProduct({
        ...otherDetails,
        productImage,
        });
        return product;
    } catch (error) {
        console.error('Error creating product in DB:', error);
        throw new InternalServerError('Failed to create product');
    }
}

async function getProductById(productId) {
  try {
    const product = await ProductRepository.getProductById(productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

async function deleteProductById(productId) {
  try {
    const deletedProduct = await ProductRepository.deleteProductById(productId);
    if (!deletedProduct) {
      throw new NotFoundError('Product not found');
    }
    return deletedProduct;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

module.exports = {
    createProduct,
    getProductById,
    deleteProductById
};
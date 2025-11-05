const Product = require('../schema/productSchema');
const InternalServerError = require('../utils/internalServerError');
const BadRequestError = require('../utils/badRequestError');
const NotFoundError = require('../utils/notFoundError');

    async function createProduct(productDetails){
        try { 
            const response = await Product.create(productDetails);
            return response;
        } catch (error) {
            if(error.name == 'MongoServerError')   throw new InternalServerError;
            else if(error.name == 'ValidationError'){
                const errorList = Object.keys(error.errors).map((property)=>{
                    return error.errors[property].message;
                });
                throw new BadRequestError(errorList);
            }
            console.log(error);

            throw new InternalServerError();
        }
    }

    async function getProductById(productId) {
        try {
            const product = await Product.findById(productId);

            // When ID is valid format but product does not exist
            if (!product) throw new NotFoundError('Product not found');

            return product;
        } catch (error) {
            if (error.name === 'CastError') {
            // Invalid ObjectId format (e.g., "12345")
            throw new BadRequestError('Invalid product ID format');
            }

            // All other errors
            throw new InternalServerError('Failed to fetch product');
        }
    }

    async function deleteProductById(productId) {
        try {
            const deleted = await Product.findByIdAndDelete(productId);

            if (!deleted) throw new NotFoundError('Product not found');

            return deleted;
        } catch (error) {
            if (error.name === 'CastError') {
            throw new BadRequestError('Invalid product ID format');
            }
            throw new InternalServerError('Failed to delete product');
        }
    }


    module.exports = {
        createProduct,
        getProductById,
        deleteProductById
    };
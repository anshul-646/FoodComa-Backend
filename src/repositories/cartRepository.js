const mongoose = require('mongoose');
const Cart = require('../schema/cartSchema');
const BadRequestError = require('../utils/badRequestError');
const InternalServerError = require('../utils/internalServerError');
const NotFoundError = require('../utils/notFoundError');

async function createCart(userId){
    try {
        const newCart = await Cart.create({
            user : userId
        });

        return newCart;
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

async function getCartByUserId(userId){
    try {
        const cart = await Cart.findOne({
            user : userId
        }).populate('items.product');
        return cart;
    } catch (error) {
        console.error("Error fetching cart by userId:", error);
        throw new InternalServerError("Failed to fetch user cart");
    }
}

async function clearCart(userId){
    try {
        const cart = await Cart.findOne({user : userId});
        if(!cart){
            throw new NotFoundError("Cart");
        }
        cart.items = [];

        await cart.save();

        return cart;
    } catch (error) {
        console.error("Error fetching cart by cartId:", error);
        throw new InternalServerError("Failed to fetch user cart");
    }
}

module.exports = {
    createCart,
    getCartByUserId,
    clearCart
}
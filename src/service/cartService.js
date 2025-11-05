const { getCartByUserId, clearCart } = require("../repositories/cartRepository");
const AppError = require("../utils/appError");
const BadRequestError = require("../utils/badRequestError");
const NotFoundError = require("../utils/notFoundError");
const { getProductById } = require("./productService");

async function getCart(userId){
    const cart = await getCartByUserId(userId);
    if(!cart){
        throw new NotFoundError("Cart");
    }

    return cart;
}

async function modifyCart(userId,productId,shouldAdd = true){
    const cart = await getCart(userId);
    const product = await getProductById(productId);

    if(!product){
        throw new NotFoundError("Product");
    }
    if(!product.inStock && product.quantity <= 0){
        throw new BadRequestError(["Product not available in stock"]);
    }

    let foundProduct = false;
    cart.items.forEach(item => {
        if(item.product.equals(productId)){
            foundProduct = true;
            if(shouldAdd){
                if (product.quantity <= 0) {
                    throw new AppError("Out Of Stock", 404);
                    }

                    item.quantity += 1;
                    product.quantity -= 1;
            }
            else{
                if (item.quantity > 1) {
                    item.quantity -= 1;
                    product.quantity += 1; // restore stock
                    } else {
                    // Remove item completely
                    cart.items = cart.items.filter(
                        (i) => !i.product.equals(productId)
                    );
                    product.quantity += 1;
                }
            }
        }
    });

    if(!foundProduct){
        if(shouldAdd){
            cart.items.push({
                product : productId,
                quantity : 1
            });
             product.quantity -= 1;
        }
        else{
            throw new NotFoundError("Product in the cart");
        }
    }

    await cart.save();
    await product.save();

    return cart;
}

async function clearProductsFromCart(userId){
    const response = await clearCart(userId);

    return response;
}
module.exports = {
    getCart,
    modifyCart,
    clearProductsFromCart
}
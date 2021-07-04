const mongoose = require('mongoose');
const Cart = require('../models/cartModel');


module.exports = {
    addToCart,
    deleteFromCart,
    getCartById,
    getUserCartsByUserId,
    deleteUserCartsByUserId
}


async function addToCart(cart) {
    cart._id = new mongoose.Types.ObjectId();
    const cartSchema = new Cart(cart);

    const cartCreated = await cartSchema.save();

    console.log('New cart created:\n ' + cartCreated);
    return cartCreated;
}

async function getCartById(cartID) {
    const cart = await Cart.findOne({ _id: cartID }).populate('itemID');

    if (cart) {
        console.log('Cart got by id:\n ' + cart);
    } else {
        console.log('Get cart by id failed because cart not found.\n ' + cartID);
    }
    return cart;
}

async function getUserCartsByUserId(userID) {
    const carts = await Cart.find({ userID }).populate('itemID');

    console.log('User carts:\n ', carts);
    return carts;
}

async function deleteUserCartsByUserId(userID) {
    const res = await Cart.deleteMany({ userID });

    console.log('User carts removed. userID: ', userID);
    return res;
}

async function deleteFromCart(cartID) {
    const deletedCart = await Cart.findOneAndDelete({ _id: cartID }).populate('itemID');

    if (deletedCart) {
        console.log('Cart deleted:\n ', deletedCart);
    } else {
        console.log('Cart delete failed because cart not found.');
    }
    return deletedCart;
}

const mongoose = require('mongoose');
const Order = require('../models/orderModel');

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    deleteOrder
}

async function getOrders(filter = {}) {
    const oreders = await Order.find(filter).populate('items.itemID');

    console.log('oreders got:\n ' + oreders);
    return oreders;
}

async function getOrderById(orderID) {
    const order = await Order.findOne({ _id: orderID }).populate('items.itemID');

    if (order) {
        console.log('User got by id:\n ' + order);
    } else {
        console.log('Get user by id failed because user not found.\n ' + orderID);
    }
    return order;
}

async function deleteOrder(orderID) {
    const deletedOrder = await Order.findOneAndDelete({ _id: orderID });

    if (deletedOrder) {
        console.log('Order deleted:\n ', deletedOrder);
    } else {
        console.log('Order delete failed because order not found.');
    }
    return deletedOrder;
}

async function createOrder(data) {
    data._id = new mongoose.Types.ObjectId();

    const orderSchema = new Order(data)
    const orderCreated = await orderSchema.save();

    console.log('New order created:\n ' + orderCreated);
    return orderCreated;
}

async function deleteOrder(orderID) {
    const deletedOrder = await Order.findOneAndDelete({ _id: orderID });

    if (deletedOrder) {
        console.log('Item deleted:\n ', deletedOrder);
    } else {
        console.log('Item delete failed because item not found.');
    }
    return deletedOrder;
}


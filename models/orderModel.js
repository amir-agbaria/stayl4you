var mongoose = require('mongoose');
var itemCartSchema = require('mongoose').model('Cart').schema;

var schema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderDetails: {
        type: {
            email: { type: String, required: true, lowercase: true },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            phone: { type: String, required: true },
            address: {
                State: { type: String, required: true },
                city: { type: String, required: true },
                street: { type: String, required: true },
                zipCode: { type: String, required: true },
            }
        },
        required: true,
    },
    items: {
        type: [itemCartSchema],
        ref: 'Cart',
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    totalPrice: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Order', schema);

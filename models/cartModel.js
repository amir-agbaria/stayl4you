var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    itemID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Item'
    },
    size: {
        type: String,
        required: true,
        enum: ['xs', 's', 'm', 'l', 'xl', 'xxl'],
        lowercase: true
    },
    orderDate: { type: Date, default: new Date }
});

module.exports = mongoose.model('Cart', schema);

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    email: { type: String, required: true, lowercase: true },
    password: { type: String, required: true },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    address: {
        type: {
            State: { type: String, required: true },
            city: { type: String, required: true },
            street: { type: String, required: true },
            zipCode: { type: String, required: true },
        }, default: null
    },
    phone: { type: String, default: null },
    isAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', schema);

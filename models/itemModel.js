var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imgUrl: { type: String, required: true },
    description: { type: String, required: true },
    sizes: {
        type: [String],
        enum: ['xs', 's', 'm', 'l', 'xl', 'xxl'],
        lowercase: true,
        required: true
    },
    category: {
        type: String,
        enum: ['shirt', 'pants'],
        lowercase: true,
        required: true
    }
});

module.exports = mongoose.model('Item', schema);

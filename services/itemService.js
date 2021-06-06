const mongoose = require('mongoose');
const Item = require('../models/itemModel');


module.exports = {
    getItems,
    getItemByID,
    createItem,
    deleteItem,
}

async function getItems(filter = {}) {
    const items = await Item.find(filter);

    console.log('Items got:\n ' + items);
    return items;
}

async function getItemByID(itemID) {
    const item = await Item.findOne({ _id: itemID });

    if (item) {
        console.log('Item got by id:\n ' + item);
    } else {
        console.log('Get item by id failed because item not found.\n ' + itemID);
    }
    return item;
}

async function createItem(item) {
    item._id = new mongoose.Types.ObjectId();

    item.sizes = item.sizes.map(size => size.toLowerCase());

    const itemSchema = new Item(item)

    const createdItem = await itemSchema.save();

    console.log('New item created:\n ', createdItem);
    return createdItem;
}

async function deleteItem(itemID) {
    const deletedItem = await Item.findOneAndDelete({ _id: itemID });

    if (deletedItem) {
        console.log('Item deleted:\n ', deletedItem);
    } else {
        console.log('Item delete failed because item not found.');
    }
    return deletedItem;
}

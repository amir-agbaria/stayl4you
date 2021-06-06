const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const salt = parseInt(process.env.SALT, 10);

module.exports = {
    createUser,
    getUserById,
    deleteUser,
    getUserByEmail,
    updateUser
}

async function createUser(user) {
    let { email, password } = user;
    const _id = new mongoose.Types.ObjectId();

    const hash = await bcrypt.hash(password, salt);

    const userSchema = new User({ _id, email, password: hash })
    const userCreated = await userSchema.save();

    console.log('New user created:\n ' + userCreated);
    return userCreated;
}

async function getUserById(userID) {
    const user = await User.findOne({ _id: userID });

    if (user) {
        console.log('User got by id:\n ' + user);
    } else {
        console.log('Get user by id failed because user not found.\n ' + userID);
    }
    return user;
}

async function deleteUser(userID) {
    const deletedUser = await User.findOneAndDelete({ _id: userID });

    if (deletedUser) {
        console.log('User deleted:\n ', deletedUser);
    } else {
        console.log('User delete failed because user not found.');
    }
    return deletedUser;
}

async function getUserByEmail(email) {
    const user = await User.findOne({ email });

    console.log('User got by email:\n ' + user);
    return user;
}

async function updateUser(user) {
    const updatedUser = await User.findOneAndUpdate({ _id: user._id }, user, { new: true });

    console.log('Updated user:\n' + updatedUser);
    return updatedUser;
}

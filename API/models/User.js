const mongoose = require('mongoose');
// const Token = require('../models/Token');
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    fullname: {type: String, required: true},
    account_num: {type: Number, required: true},
    account_bal: {type: Number},
    verified: {type: Boolean, default: false}
}, {timestamps: true}, {collection: 'users'});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id: this._id}, process.env.JWT_SEC, {
        expiresIn: "7d",
    });
    return token;
};

module.exports = mongoose.model('User', userSchema);
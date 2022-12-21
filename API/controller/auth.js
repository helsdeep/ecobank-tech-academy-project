// const express = require('express');
const jwt = require('jsonwebtoken');
const createError = require('../utils/error');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Token = require('../models/Token');
const crypto = require('crypto');
const sendMail = require('../utils/sendMail');
// const router = express.Router();


const register = async (req, res, next) => {
    // const {email, password: plainTextPassword, fullname, account_num} = req.body;

    // if (!email || !password || !fullname || !account_num){
    //     return res.status(400).json({status: 'error', msg: 'All fields must be entered'});
    // }

    // if(plainTextPassword.length <=6){
    //     return res.status(400).json({status: 'error', msg: 'Password is too short'});
    // }

    // const password = await bcrypt(plainTextPassword, 10);

    try {
        const existingUser = await User.findOne({email: req.body.email});
        if(existingUser) return res.status(400).json('User with given email already exist!');

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        let newUser = new User({
            ...req.body,
            password: hash
        });

        

        const savedUser = await newUser.save();
        const token = await new Token({
            userId: savedUser._id,
            token: crypto.randomBytes(32).toString('hex'),
        }).save();
        const url = `${process.env.BASE_URL}users/${savedUser._id}/verify/${token.token}`;
        await sendMail(savedUser.email, 'Congratulations on your signup to ecoAacademy cash-management-platform please verify', url);

        res.status(201).json({mssg: 'An Email sent to your account please verify'});

    } catch (err) {
        next(err)
    }
};

const verifyMail = async (req, res, next) => {
    try {
        const user = await User.findOne({id: req.params.id});
        if(!user) return res.status(400).send({message: 'Invalid link'});
        const token = await Token.findOne({userId: savedUser._id, token: req.params.token});
        if(!token) return res.status(400).json({message: 'Invalid link'});

        await User.updateOne({id:user._id, verified: true});
        await token.remove();

        res.status(200).json({message: 'Email verified successfully'});
    } catch (err) {
        next(err);
    }
}

const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) return next(createError(404, 'User not found!'));

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

        const token = jwt.sign({
            id: user._id,
            email: user.email,
            account_num: user.account_num
        }, process.env.JWT_SECRET, { expiresIn: '3d' });

        if (!isPasswordCorrect) return next(createError(400, 'Wrong password or username'));
        // const accountNumber = await User.findByIdAndUpdate({req.})
        const { password, ...info } = user._doc
        res.cookie('access_token', token, {
            httpOnly: true,
        })
        .status(200)
        .json({details: {...info}, });
    } catch (err) {
        next(err);
    }

}







module.exports = {login, register, verifyMail};

const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require('bcryptjs');
const Token = require("../models/Token");
const crypto = require("crypto");
const sendMail = require("../utils/sendMail");

//verify
const checkVerified = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
    if(!user)
        return res.status(400).json({message: 'Invalid Email or password'});

    const validPassword = await bcrypt.compare(
        req.body.password, user.password
    );
    if(!validPassword) return res.status(401).json({message: 'Invalid email or password'});

        if (!user.verified) {
        let token = await Token.findOne({userId: user._id});

        if(!token){
            const token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString('hex'),
            }).save();
            const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
        await sendMail(user.email, 'Verify Email', url);
        }
        
        return res.status(400).json({message: 'An Email sent to your Account, please verify',user})
        }
        
    const tokenVerify = user.generateAuthToken();
    const {password, ...info} = user._doc
    res.status(200).json({data: info,tokenVerify, message: 'logged in successfully'});
    } catch (err) {
        next(err);
    };
};

//VERIFY MAIL
const verifyMail = async (req, res, next) => {
    try {
        const user = await User.findOne({id: req.params.id});
        if(!user) return res.status(400).send({message: 'Invalid link'});
        const token = await Token.findOne({userId: req.params.id, token: req.params.token});
        if(!token) return res.status(400).json({message: 'Invalid link'});

        await User.updateOne(user._id, { $set: {verified:true} }, {new: true});
        await token.remove();

        res.status(200).json({message: 'Email verified successfully'});
    } catch (err) {
        next(err);
    }
}

//UPDATE ONE
const updatedUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, {
                $set: req.body
            },
            {new: true}
        )
        res.status(200).json(updatedUser);
    } catch (err) {
        next(err)
    }
}

//GET ONE
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(
            req.params.id
        );
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

module.exports = {checkVerified, updatedUser, verifyMail, getUser};
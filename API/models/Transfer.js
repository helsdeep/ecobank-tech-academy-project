const mongoose = require('mongoose')

const transferSchema = mongoose.Schema({
    sender_acct: {type: Number},
    recipient_acct: {type: Number},
    recipient_bank: {type: String},
    amount: {type: Number},
    remark: String
}, {timestamps: true}, {collection: 'transfers'});


module.exports = mongoose.model('Transfer', transferSchema);
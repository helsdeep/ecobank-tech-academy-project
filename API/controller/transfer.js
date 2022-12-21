const createError = require('../utils/error');
const User = require('../models/User');
const Transfer = require('../models/Transfer');

const transfer = async (req, res, next) => {

    try {
    const found = await User.findOne({
            // _id: req.body.beneficiary_id,
            account_num: req.body.recipient_acct
        });

        if (!found) {
            return res.status(404).json({ status: 'error', message: 'This account does not exist' });
        }

        let transfer = new Transfer({
            ...req.body
        });
        
        await transfer.save();

        let user = await User.findOne(
            { account_num: req.body.sender_acct }
        );

        if (user.account_bal < req.body.amount){
            return res.status(400).json('Insufficient funds')
        }

        let foundUser = await User.updateOne(
            { account_num: req.body.sender_acct },
            { "$inc": { "account_bal": -req.body.amount } }
        ).select(['-email', '-password', '-fullname', '-verified']).lean();

        await User.updateOne(
            { account_num: req.body.recipient_acct },
            { "$inc": { "account_bal": req.body.amount } }
        );
        return res.status(200).json({ status: 'ok', message: 'Transfer successful', foundUser });

        
    } catch (err) {
        // next(createError(404,'An Error occurred'));
        console.log(err);
        return res.status(400).json({ status: 'error', message: 'An error occurred'});
    }
}

module.exports = {transfer};
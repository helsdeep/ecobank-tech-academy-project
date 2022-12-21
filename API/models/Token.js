const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = mongoose.Schema({
    userId : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
        unique: true,
    },
    token: {type: String, required: true},
    createdAt: {type: Date, default: Date.now(), expires: 3600} //1Hour
},

);

module.exports = mongoose.model('Token', tokenSchema);
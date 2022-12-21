const express = require('express');

const { verifyUser } = require('../utils/verify');
const { transfer } = require('../controller/transfer');

const router = express.Router();

router.post('/transfer', transfer);



module.exports = router;
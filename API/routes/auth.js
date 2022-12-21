const router = require("express").Router();
const {login, register, verifyMail} = require('../controller/auth');

router.post('/register', register);
router.post('/login', login);


module.exports = router;
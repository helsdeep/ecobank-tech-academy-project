const router = require("express").Router();
const {checkVerified, verifyMail, getUser} = require('../controller/user');
const { verifyUser } = require("../utils/verify");
//login and register
router.post('/', checkVerified);

// router.get("/:id/verify/:token", checkVerified);
//Mail verification
router.get('/:id/verify/:token', verifyMail);

//GET ONE USER
router.get("/:id", verifyUser, getUser);


module.exports = router;
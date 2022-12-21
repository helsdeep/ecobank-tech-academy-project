const jwt = require('jsonwebtoken');
const createError = require('./error');

const verifyToken = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(createError(401, 'You are not authenticated!...'))
    };

    jwt.verify(token, process.env.JWT_SEC, (err, user)=> {
        if(err) return next(createError(403, 'Token invalid'));
        req.user = user;
        next()
    })
    }

    const verifyUser = (req, res, next) => {
        verifyToken(req, res, next, ()=> {
            if(req.user.id === req.params.id ){
                next();
            }else {
                if(err) return next(createError(403, 'You are not authorized!'));
            };
        });
    };
    


module.exports = {verifyToken, verifyUser};


const { verifyToken } = require('./jwt');
const  User  = require('./db/model/user-model');

module.exports = (req, res, next) => {
    const token = req.cookies['x-token'] || '';

    if (!token) {
        next();
        return;
    }

    verifyToken(token)
        .then(({ _id }) => User.findOne({ _id }))
        // see what is needed
        //
        // delete the email and full name if it is needed                                                        
        //
        .then(({ email, _id }) => {
            req.user = { email, _id };
            res.isLogged = Boolean(req.user);
            next();
        })
        .catch((e) => next(e));
};
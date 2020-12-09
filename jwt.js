const jwt = require('jsonwebtoken');

module.exports = {

    createToken(_id) {
        return jwt.sign({ _id }, "DailyAssistentSecret", { expiresIn: '1h' })
    },

    verifyToken(token) {

        return new Promise((resolve, reject) => {
            jwt.verify(token, "DailyAssistentSecret", (err, payload) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(payload);
            })
        })
    }
};
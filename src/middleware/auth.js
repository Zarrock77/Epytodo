const jwt = require('jsonwebtoken')

function authorization(res, headers, secret, callback) {
    if ('authorization' in headers) {
        let decodedToken;
        try {
            decodedToken = jwt.verify(headers.authorization, secret)

            if (decodedToken) {
                callback(decodedToken.id, decodedToken.email)
            } else {
                res.json({ msg: 'Token is not valid' })
                callback(undefined)
            }
        } catch {
            res.status(401).json({ msg: 'Token is not valid' })
            callback(undefined)
        }
    } else {
        res.status(401).json({ msg: 'No token, authorization denied' })
        callback(undefined)
    }
}

module.exports = authorization

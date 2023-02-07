// Library import
const jwt = require('jsonwebtoken');

// Utilities import
require('dotenv').config({ path: '../.env'});

module.exports.userAuth = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] || req.cookies.accessKey

    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.USER_ACCESS_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

module.exports.sellerAuth = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] || req.cookies.accessKey

    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.SELLER_ACCESS_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

module.exports.riderAuth = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] || req.cookies.accessKey

    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.RIDER_ACCESS_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
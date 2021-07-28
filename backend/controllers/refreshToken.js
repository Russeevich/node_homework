const jwt = require('jsonwebtoken')
const { useDB } = require('../database')
const User = require('../database/user')

const secretKey = process.env.SECRET_KEY

module.exports = {
    getRefresh: async(req, res, next) => {
        const { username } = jwt.verify(req.headers.authorization, secretKey)

        const people = await useDB(async() => await User.findOne({ username }))

        if (!people) {
            res.status(500).send({ success: false, message: 'Ошибка обновления токена' })
        }

        const auth = {
            accessToken: jwt.sign({ username: username, date: Date.now() }, secretKey),
            refreshToken: jwt.sign({ username: username, date: Date.now() + 1000 * 60 * 60 }, secretKey),
            accessTokenExpiredAt: Date.now(),
            refreshTokenExpiredAt: Date.now() + 1000 * 60 * 60
        }

        res.status(200).send({ success: true, ...auth })
    }
}
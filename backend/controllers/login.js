const jwt = require('jsonwebtoken')
const user = require('../database/user')

const secretKey = process.env.SECRET_KEY


module.exports = {
    getLogin: async(req, res, next) => {
        const { username, password } = req.body

        const people = await user.findOne({ username })

        console.log(people, password)

        if (people.password !== password) {
            return res.status(500).send({ success: false, message: 'Неверный логин или пароль' })
        }

        const auth = {
            accessToken: jwt.sign({ username: username, date: Date.now() }, secretKey),
            refreshToken: jwt.sign({ username: username, date: Date.now() + 1000 * 60 * 60 }, secretKey),
            accessTokenExpiredAt: Date.now(),
            refreshTokenExpiredAt: Date.now() + 1000 * 60 * 60
        }

        const token = {...people.toJSON(), ...auth }

        res.status(200).send({ success: true, ...token })
    }
}
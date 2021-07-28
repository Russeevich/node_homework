const jwt = require('jsonwebtoken')
const User = require('../database/user')
const { useDB } = require('../database')
const bcrypt = require('bcrypt')

const secretKey = process.env.SECRET_KEY


module.exports = {
    getLogin: async(req, res, next) => {
        const { username, password } = req.body

        const people = await useDB(async() => await User.findOne({ username }))

        const isPassword = await bcrypt.compare(password, people.password)

        if (!isPassword)
            return res.status(500).send({ success: false, message: 'Неверный логин или пароль' })

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
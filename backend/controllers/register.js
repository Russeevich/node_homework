const jwt = require('jsonwebtoken')
const { useDB } = require('../database')
const User = require('../database/user')
const bcrypt = require('bcrypt')

const secretKey = process.env.SECRET_KEY
const salt = parseInt(process.env.SALT)

module.exports = {
    getRegister: async(req, res, next) => {
        const { username, surName, firstName, middleName, password } = req.body

        const hash = await bcrypt.hash(password, salt)

        if (!hash)
            return res.status(500).send({ success: false, message: 'Ошибка генерации хэша' })


        const auth = {
            accessToken: jwt.sign({ username: username, date: Date.now() }, secretKey),
            refreshToken: jwt.sign({ username: username, date: Date.now() + 1000 * 60 * 60 }, secretKey),
            accessTokenExpiredAt: Date.now(),
            refreshTokenExpiredAt: Date.now() + 1000 * 60 * 60
        }

        const newUser = new User({
            username,
            surName,
            firstName,
            middleName,
            password: hash
        })

        const people = await useDB(async() => {
            await newUser.save()
            return await User.findOne({ username })
        })

        const token = {...people.toJSON(), ...auth }

        res.status(200).send({ success: true, ...token })

    }
}
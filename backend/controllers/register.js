const jwt = require('jsonwebtoken')
const user = require('../database/user')

const secretKey = process.env.SECRET_KEY

module.exports = {
    getRegister: (req, res, next) => {
        const { username, surName, firstName, middleName, password } = req.body

        const newUser = new user({
            username,
            surName,
            firstName,
            middleName,
            password
        })

        newUser.save().then(() => console.log('Пользователь успешно добавлен')).catch(err => console.log(err))

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
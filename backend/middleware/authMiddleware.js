const jwt = require('jsonwebtoken')
const User = require('../database/user')
const { useDB } = require('../database')

const secretKey = process.env.SECRET_KEY

module.exports = {
    getAuth: async(req, res, next) => {
        const authorization = req.headers.authorization || null

        if (!authorization)
            return next(new Error('Не авторизирован'))

        const { username } = jwt.verify(authorization, secretKey)

        const people = await useDB(async() => await User.findOne({ username }))

        if (!people)
            return next(new Error('Ошибка чтения данных'))

        return next()
    }
}
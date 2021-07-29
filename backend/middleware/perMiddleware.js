const jwt = require('jsonwebtoken')
const User = require('../database/user')
const { useDB } = require('../database')

const secretKey = process.env.SECRET_KEY

const methods = {
    POST: 'C',
    GET: 'R',
    PATCH: 'U',
    DELETE: 'D'
}

module.exports = {
    news: async(req, res, next) => {
        const authorization = req.headers.authorization

        const { username } = jwt.verify(authorization, secretKey)

        const people = await useDB(async() => await User.findOne({ username }))

        if (!people.permission.news[methods[req.method]])
            return next(new Error('Нет прав для доступа'))

        return next()
    },
    admin: async(req, res, next) => {
        const authorization = req.headers.authorization

        const { username } = jwt.verify(authorization, secretKey)

        const people = await useDB(async() => await User.findOne({ username }))

        if (!people.permission.settings[methods[req.method]])
            return next(new Error('Нет прав для доступа'))

        return next()
    }
}
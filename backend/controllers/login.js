const jwt = require('jsonwebtoken')
const user = require('../database/user')

const secretKey = process.env.SECRET_KEY


module.exports = {
    getLogin: async(req, res, next) => {
        const { username, password } = req.body

        const people = await user.findOne({ username })

        if (people.password !== password) {
            res.status(500).send({ success: false, message: 'Неверный логин или пароль' })
        }

        const token = jwt.sign(people.toJSON(), secretKey)

        res.status(200).send({ suceess: true, token })
    }
}
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
    }
}
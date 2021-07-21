const jwt = require('jsonwebtoken')
const user = require('../database/user')
const path = require('path')
const fs = require('fs')

const secretKey = process.env.SECRET_KEY

module.exports = {
    getProfile: async(req, res, next) => {
        const { username } = jwt.verify(req.headers.authorization, secretKey)

        const people = await user.findOne({ username }, { password: false })

        if (!people) {
            return res.status(500).send({ success: false, message: 'Ошибка чтения данных пользователя' })
        }

        res.status(200).send({ success: true, ...people.toJSON() })
    },
    updateProfile: async(req, res, next) => {
        const { surName, firstName, middleName, oldPassword, newPassword } = req.body
        const avatar = req.files.avatar ? req.files.avatar[0] : null
        const authorization = req.headers.authorization || null

        if (authorization) {
            const { username } = jwt.verify(authorization, secretKey)

            const people = await user.findOne({ username })

            if (!people) {
                return res.status(500).send({ success: false, message: 'Ошибка чтения данных пользователя' })
            }

            if (avatar) {
                if (people.image) {
                    const oldPath = path.join(avatar.destination, people.image)
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath)
                    }
                }
                fs.renameSync(avatar.path, path.join(avatar.destination, avatar.originalname))
                const image = avatar ? avatar.originalname : null
                await user.updateOne({ username }, { image })
            }

            if (newPassword.length > 0) {
                if (people.password !== oldPassword) {
                    return res.status(501).send({ success: false, message: 'Введен не верный пароль' })
                }

                await user.updateOne({ username }, { password: newPassword })
            }

            if (surName.length > 3) {
                if (surName.trim() === '') {
                    return res.status(501).send({ success: false, message: 'Длина поля не соотвествует' })
                }
                await user.updateOne({ username }, { surName })
            }

            if (firstName.length > 3) {
                if (firstName.trim() === '') {
                    return res.status(501).send({ success: false, message: 'Длина поля не соотвествует' })
                }
                await user.updateOne({ username }, { firstName })
            }

            if (middleName.length > 3) {
                if (middleName.trim() === '') {
                    return res.status(501).send({ success: false, message: 'Длина поля не соотвествует' })
                }
                await user.updateOne({ username }, { middleName })
            }

            const updatedUser = await user.findOne({ username })

            res.status(201).json({ success: true, ...updatedUser.toJSON() })
        } else {
            res.status(500).send({ success: false, message: 'Ошибка авторизации' })
        }
    }
}
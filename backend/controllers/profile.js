const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../database/user')
const { useDB } = require('../database')
const path = require('path')
const fs = require('fs')

const secretKey = process.env.SECRET_KEY

module.exports = {
    getProfile: async(req, res, next) => {
        const { username } = jwt.verify(req.headers.authorization, secretKey)

        const people = await useDB(async() => await User.findOne({ username }, { password: false }))

        res.status(200).send({ success: true, ...people.toJSON() })
    },
    updateProfile: async(req, res, next) => {
        const { surName, firstName, middleName, oldPassword, newPassword } = req.body
        const avatar = req.files.avatar ? req.files.avatar[0] : null
        const authorization = req.headers.authorization || null

        const { username } = jwt.verify(authorization, secretKey)

        const people = await useDB(async() => await User.findOne({ username }))

        let image

        if (avatar) {
            if (people.image) {
                const oldPath = path.join(avatar.destination, people.image)
                const fileEx = await fs.promises.exists(oldPath)
                if (fileEx) {
                    await fs.promises.unlink(oldPath)
                }
            }
            await fs.promises.rename(avatar.path, path.join(avatar.destination, avatar.originalname))
            image = avatar ? avatar.originalname : null
        }

        if (newPassword.length > 0) {
            if (await bcrypt.compare(oldPassword, people.password)) {
                return res.status(501).send({ success: false, message: 'Введен не верный пароль' })
            }
        }

        if (surName.length > 3) {
            if (surName.trim() === '') {
                return res.status(501).send({ success: false, message: 'Длина поля не соотвествует' })
            }
        }

        if (firstName.length > 3) {
            if (firstName.trim() === '') {
                return res.status(501).send({ success: false, message: 'Длина поля не соотвествует' })
            }
        }

        if (middleName.length > 3) {
            if (middleName.trim() === '') {
                return res.status(501).send({ success: false, message: 'Длина поля не соотвествует' })
            }
        }

        const updatedUser = await useDB(async() => {
            await User.updateOne({ username }, { middleName, firstName, surName, password: await bcrypt.hash(newPassword, salt), image })
            return await User.findOne({ username })
        })

        res.status(201).json({ success: true, ...updatedUser.toJSON() })
    }
}
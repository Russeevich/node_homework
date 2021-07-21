const jwt = require('jsonwebtoken')
const user = require('../database/user')

const secretKey = process.env.SECRET_KEY

module.exports = {
    getUsers: async(req, res, next) => {
        let users = await user.find({}, { password: false })
        res.status(200).send(users)
    },
    setUserPermission: async(req, res, next) => {
        const { id } = req.params
        const { permission } = req.body

        await user.updateOne({ _id: id }, { permission })
        res.status(201).send({ success: true, message: 'All updated' })
    },
    deleteUser: async(req, res, next) => {
        const { id } = req.params

        await user.deleteOne({ _id: id })
        res.status(201).send({ success: true, message: 'People deleted' })
    }
}
const User = require('../database/user')
const { useDB } = require('../database')

module.exports = {
    getUsers: async(req, res, next) => {
        const users = await useDB(async() => await User.find({}, { password: false }))

        res.status(200).send(users)
    },
    setUserPermission: async(req, res, next) => {
        const { id } = req.params
        const { permission } = req.body

        await useDB(async() => await User.updateOne({ _id: id }, { permission }))

        res.status(201).send({ success: true, message: 'All updated' })
    },
    deleteUser: async(req, res, next) => {
        const { id } = req.params

        await useDB(async() => await User.deleteOne({ _id: id }))

        res.status(201).send({ success: true, message: 'People deleted' })
    }
}
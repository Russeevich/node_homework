const jwt = require('jsonwebtoken')
const { useDB } = require('../database')
const News = require('../database/news')
const User = require('../database/user')

const secretKey = process.env.SECRET_KEY

module.exports = {
    getNews: async(req, res, next) => {
        const allNews = await useDB(async() => await News.find({}))

        res.status(200).send(allNews)
    },
    addNews: async(req, res, next) => {
        const { title, text } = req.body

        const { username } = jwt.verify(req.headers.authorization, secretKey)

        const people = await useDB(async() => await User.findOne({ username }, {
            password: false,
            permission: false
        }))

        const Newsadd = new News({
            title,
            text,
            user: people
        })

        const allNews = await useDB(async() => {
            await Newsadd.save()
            return await News.find({})
        })

        res.status(200).send(allNews)
    },
    updateNews: async(req, res, next) => {
        const { id } = req.params
        const { title, text } = req.body

        const allNews = await useDB(async() => {
            await News.updateOne({ _id: id }, { title, text })
            return await News.find({})
        })

        res.status(200).send(allNews)
    },
    deleteNews: async(req, res, next) => {
        const { id } = req.params

        const allNews = await useDB(async() => {
            await News.deleteOne({ _id: id })
            return await News.find({})
        })

        res.status(200).send(allNews)
    }
}
const jwt = require('jsonwebtoken')
const news = require('../database/news')
const user = require('../database/user')

const secretKey = process.env.SECRET_KEY

module.exports = {
    getNews: async(req, res, next) => {
        const allNews = await news.find({})

        res.status(200).send(allNews)
    },
    addNews: async(req, res, next) => {
        const { title, text } = req.body

        const { username } = jwt.verify(req.headers.authorization, secretKey)

        const people = await user.findOne({ username }, {
            password: false,
            permission: false
        })

        console.log(people)

        const Newsadd = new news({
            title,
            text,
            user: people
        })

        Newsadd.save().then(() => console.log('Новость успешно добавлена')).catch(err => console.log(err))

        const allNews = await news.find({})

        res.status(200).send(allNews)
    },
    updateNews: async(req, res, next) => {
        const { id } = req.params
        const { title, text } = req.body

        await news.updateOne({ _id: id }, { title, text })

        const allNews = await news.find({})

        res.status(200).send(allNews)
    },
    deleteNews: async(req, res, next) => {
        const { id } = req.params

        await news.deleteOne({ _id: id })

        const allNews = await news.find({})

        res.status(200).send(allNews)
    }
}
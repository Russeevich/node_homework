const mongoose = require('mongoose')

const mongoHost = "mongodb+srv://root:120evazus@cluster0.vu0xe.mongodb.net/LoftSchool?retryWrites=true&w=majority"

const connect = async() => {
    return await mongoose.connect(mongoHost, {
        useNewUrlParser: true,
        useUnifiedTopology: false,
        useFindAndModify: false,
        useCreateIndex: true
    })
}

const useDB = async(fn) => {
    const db = await connect()

    const result = await fn()

    await db.connection.close()

    return result
}

module.exports = {
    mongoose,
    connect,
    useDB
}
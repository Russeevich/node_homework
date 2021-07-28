const mongoose = require('mongoose')

const mongoHost = "mongodb+srv://root:120evazus@cluster0.vu0xe.mongodb.net/LoftSchool?retryWrites=true&w=majority"

const connect = async() => {
    await mongoose.connect(mongoHost, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
}

const close = async() => {
    await mongoose.disconnect()
}

const useDB = async(fn) => {
    await connect()

    const result = await fn()

    await close()

    return result
}

module.exports = {
    mongoose,
    connect,
    close,
    useDB
}
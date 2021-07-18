const mongoose = require('mongoose')

const mongoHost = "mongodb+srv://root:120evazus@cluster0.vu0xe.mongodb.net/LoftSchool?retryWrites=true&w=majority"

const init = async() => {
    await mongoose.connect(mongoHost, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
}

init()

module.exports = mongoose
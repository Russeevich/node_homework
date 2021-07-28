const { mongoose } = require('./index')

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const User = new Schema({
    id: ObjectId,
    firstName: { type: String },
    image: { type: String },
    middleName: { type: String },
    permission: {
        chat: {
            C: { type: Boolean, default: true },
            R: { type: Boolean, default: true },
            U: { type: Boolean, default: true },
            D: { type: Boolean, default: true }
        },
        news: {
            C: { type: Boolean, default: true },
            R: { type: Boolean, default: true },
            U: { type: Boolean, default: true },
            D: { type: Boolean, default: true }
        },
        settings: {
            C: { type: Boolean, default: true },
            R: { type: Boolean, default: true },
            U: { type: Boolean, default: true },
            D: { type: Boolean, default: true }
        }
    },
    surName: { type: String },
    username: { type: String, required: true, unique: true, dropDups: true },
    password: { type: String, required: true }
})

module.exports = mongoose.model('Users', User)
const { mongoose } = require('./index')

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const News = new Schema({
    id: ObjectId,
    created_at: { type: Date, default: Date.now },
    text: { type: String, required: true },
    title: { type: String, required: true },
    user: {
        firstName: { type: String },
        _id: { type: ObjectId, required: true },
        image: { type: String },
        middleName: { type: String },
        surName: { type: String },
        username: { type: String }
    }
})

module.exports = mongoose.model('News', News)
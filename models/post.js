const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const postSchema = new Schema({
    title: String,
    author: String,
    date: Date,
    body: String
});
module.exports = mongoose.model('post', postSchema);

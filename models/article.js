const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const articleSchema = new Schema({
    feedId: String,
    title: String,
    link: String,
    creator: String,
    pubDate: Date,
    content: String,
    contentSnippet: String,
    guid:String,
    categories:Array,
    isoDate:Date,
    read: {type:Boolean, default:false},
});
module.exports = mongoose.model('article', articleSchema);

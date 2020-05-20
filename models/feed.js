const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const feedSchema = new Schema({
    url: {type:String, unique:true},
    name: String,
    lastRefresh: Date,
    date: {type:Date, default:Date.now}
});
module.exports = mongoose.model('feed', feedSchema);

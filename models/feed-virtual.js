const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const feedVirtualSchema = new Schema({
    url: {type:String, unique:true},
    name: String,
    articles:{type:Array, default:[]},
    date: {type:Date, default:Date.now}
});
module.exports = mongoose.model('feed-virtual', feedVirtualSchema);

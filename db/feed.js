const mongoose = require('mongoose')
const Feed = require('../models/feed')
const Article = require('../models/article')
const util = require("util")
const url = require('url')
const Parser = require('rss-parser');
const parser = new Parser();

const defaultFeeds = [{
        _id:'home',
        url:'/feed/home',
        name:'Home',
        date:Date.now(),
        count:0,
        unread:0
    }
]

const insertFeed = async (f) =>{
    f.date = new Date();
    const feed = await Feed.create(f)
    return feed
}
const updateFeed = async (feedId, feeds) =>{
    feeds = Array.isArray(feeds) ? feeds : [feeds]
    let f = []
    for (var i = 0; i < feeds.length; i++) {
        let u = await Feed.updateOne({_id:feeds[i]._id}, feeds[i])
        let a = await Feed.findOne({_id:feeds[i]._id})
        f.push(a)
    }
    return f.length == 1 ? f[0] : f
}
const listFeeds = async () =>{
    const feeds = await Feed.find({}).lean()

    for (var i = 0; i < feeds.length; i++) {
        feeds[i].count = await Article.countDocuments({feedId:feeds[i]._id})
        feeds[i].unread = feeds[i].count - await Article.countDocuments({feedId:feeds[i]._id, read:true})
    }

    return defaultFeeds.concat(feeds)
}
const findFeed = async (id) =>{
    const feed = await Feed.findOne({_id:id}).lean()
    return feed
}
const removeFeed = async (id) =>{
    const query = id ? { _id:id} : {}
    await Feed.deleteMany(query)
    await Article.deleteMany({feedId:id})
}
module.exports = {insertFeed, listFeeds, removeFeed, findFeed, updateFeed}

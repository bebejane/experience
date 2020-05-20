const mongoose = require('mongoose')
const striptags = require('striptags')
const Article = require('../models/article')
const Feed = require('../models/feed')

const url = require('url')

const insertArticle = async (fId, a) =>{
    a = Array.isArray(a) ? a : [a]
    a.forEach((art)=>{
        console.log(a.content)
        art.feedId = fId
        art.content = striptags(a.content)
        art.read = false
        delete art.categories

    })

    const articles = await Article.insertMany(a)
    return articles
}
const upsertArticle = async (feedId, articles) =>{

    articles = Array.isArray(articles) ? articles : [articles]
    let arts = []
    for (var i = 0; i < articles.length; i++) {
        articles[i].feedId = feedId
        articles[i].content = striptags(articles[i].content)
        delete articles[i].categories
        delete articles[i]._id
        arts.push(await Article.findOneAndUpdate({
            feedId:feedId,
            guid:articles[i].guid
        }, articles[i], {
            upsert:true,
            setDefaultsOnInsert:true,
            useFindAndModify:false
        }))
    }

    return arts.length == 1 ? arts[0] : arts
}
const updateArticle = async (feedId, articles) =>{
    articles = Array.isArray(articles) ? articles : [articles]
    let arts = []
    for (var i = 0; i < articles.length; i++) {
        let u = await Article.updateOne({_id:articles[i]._id}, articles[i])
        let a = await Article.findOne({_id:articles[i]._id})
        arts.push(a)
    }
    return arts.length == 1 ? arts[0] : arts
}
const listArticles = async (query, opt = {skip:0, limit:10}) =>{
    query = typeof query == 'string' ? {feedId:query} : query
    if(opt.skip<0)
        opt.skip = 0

    const articles = await Article.find(query,{}, opt).lean()
    return articles
}
const listHomeArticles = async (opt = {skip:0, limit:0}) =>{
    const articles = await Article.find({},{},opt).sort({pubDate:'desc'}).lean()
    const feeds = await Feed.find({});
    console.log(feeds)
    articles.forEach((a)=>{
        a.feed = feeds.filter((f)=> f._id == a.feedId)[0]
        console.log(a.feed)
    })

    return articles
}

const findArticle = async (id) =>{
    const feed = await Article.findOne({_id:id}).lean()
    return feed
}
const removeArticle = async (id) =>{
    const query = id ? { _id:id} : {}
    await Article.deleteMany(query)
}
module.exports = {listHomeArticles, insertArticle, updateArticle, upsertArticle, listArticles, removeArticle, findArticle}

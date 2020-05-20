const mongoose = require('mongoose')
const striptags = require('striptags')
const Article = require('../models/article')
const Feed = require('../models/feed')

const url = require('url')

const insertArticle = async (fId, a) =>{
    a = Array.isArray(a) ? a : [a]
    a.forEach((art)=>{
        art.feedId = fId
        art.contentSnippet = stripContent(art)
        //art.read = false
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
        articles[i].contentSnippet = stripContent(articles[i])
        delete articles[i].categories
        articles[i] = await Article.findOneAndUpdate({
            feedId:feedId,
            guid:articles[i].guid
        }, articles[i], {
            upsert:true,
            setDefaultsOnInsert:true,
            useFindAndModify:false
        })
    }

    return articles.length == 1 ? articles[0] : articles
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
    //console.log(feeds)
    articles.forEach((a)=>{
        a.feed = feeds.filter((f)=> f._id == a.feedId)[0]
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
const stripContent = (article) =>{

    const sentances = striptags(article.content || article.contentSnippet).split('.')

    if(sentances.length > 0)
        return sentances[0] + '.'
    else
        return sentances.substring(0,100)
}
module.exports = {listHomeArticles, insertArticle, updateArticle, upsertArticle, listArticles, removeArticle, findArticle}

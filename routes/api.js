const util = require('util');
const express = require('express');
const router = express.Router();
const loadRSS = util.promisify(require("load-rss-link"))
const feedRead = util.promisify(require("feed-read"))
const Parser = require('rss-parser');
const parser = new Parser();
const googleIt = require('google-it');
const url = require('url')

const {insertFeed, listFeeds, removeFeed, findFeed, updateFeed} = require('../db/feed')
const {listArticles, listHomeArticles, findArticle, insertArticle, updateArticle, upsertArticle} = require('../db/article')

const Article = require('../models/article')

router.get('/feed', async (req, res, next)=> {
    console.log('feed')
    const feeds = await listFeeds()
    res.send(feeds)
});

router.post('/feed', async (req, res, next)=> {
    if(!req.body.url)
        return res.status(202).end()

    let u = req.body.url
    u = !u.includes('http://') && !u.includes('https://') ? 'http://' + u : u
    console.log('Add feed: ', u)
    try{

        const rssURL = await loadRSS({url:u})
        if(!rssURL){
            console.log('No RSS feed found')
            return res.status(500).send({message:'No RSS feed found for website ' + u})
        }

        const rssFeed = await parser.parseURL(rssURL)
        const feed = await insertFeed({url:rssURL, name:rssFeed.title})
        const articles = await insertArticle(feed._id, rssFeed.items)
        res.send(feed)
        console.log('inserted feed', rssURL, articles.length)
    }catch(err){
        console.error(err)
        res.status(500).send(err)
        //next(err)
    }

});
router.delete('/feed', async (req, res, next)=> {
    if(!req.body._id)
        return res.send(new Error('Invalid id'))
    console.log('delete feed')
    await removeFeed(req.body._id)
    res.status(202).end()
});

router.patch('/feed', async (req, res, next)=> {

    const feeds = Array.isArray(req.body) ? req.body : [req.body]
    const f = []
    for (var i = 0; i < feeds.length; i++) {
        f.push(await updateFeed({_id:feeds[i]._id}, feeds[i]))
    }
    res.send(f.length === 0 ? f[0] : f)
});

router.get('/feed/today', async (req, res, next)=> {
    return res.status(500).send({message:'Today is fucked', description:'Desdcription i shereeeeee'}).end()
    const feeds = await listFeeds()
    let all = []
    for (var i = 0; i < feeds.length; i++)
        all = all.concat(await listArticles(feeds[i]._id))
    all = all.sort((a,b)=>a.pubDate>b.pubDate).slice(0,20)
    res.send(all)
});

router.get('/feed/home/*', async (req, res, next)=> {
    console.log('get gome')
    const articles = await listHomeArticles({skip:0, limit:30})
    res.send({data:articles, page:1, pages:1})
});

router.get('/feed/:id', async (req, res, next)=> {
    console.log('get')
    if(!req.params.id)
        return res.status(202).end()

    const id = req.params.id
    const articles = await listArticles(id)
    res.send(articles)

});

router.patch('/feed/:id', async (req, res, next)=> {

    const articles = Array.isArray(req.body) ? req.body : [req.body]
    console.log('patch feed articles', articles)
    const art = []
    for (var i = 0; i < articles.length; i++) {
        art.push(await updateArticle({_id:articles[i]._id}, articles[i]))
    }

    res.send(art.length === 1 ? art[0] : art)
});

router.get('/feed/:id/page/:page', async (req, res, next)=> {
    if(!req.params.id)
        return res.status(202).end()

    //console.log('list', req.params.id, req.params.page)
    const id = req.params.id
    const total = await Article.countDocuments({feedId:id});
    const pages = Math.ceil(total/10)
    const offset = parseInt(req.params.page) === 1 ? 0 : (parseInt(req.params.page)-1)*10;
    const opt = {skip:offset, limit:10}
    const articles = await listArticles(id, opt)
    res.send({data:articles, page:parseInt(req.params.page), pages:pages})
    console.log(opt)

});

router.get('/feed/:id/refresh', async (req, res, next)=> {

    if(!req.params.id)
        return res.status(202).end()

    console.log(req.params.id)
    const feed = await findFeed({_id:req.params.id})
    const rssFeed = await parser.parseURL(feed.url)
    const articles = await upsertArticle(feed._id, rssFeed.items)
    res.send(articles)

});

router.get('/feed/:feedId/:id', async (req, res, next)=> {
    console.log('article')
    if(!req.params.id)
        return res.status(202).end()

    const id = req.params.id
    const feedId = req.params.feedId
    const article = await findArticle(id)
    res.send(article)

});

router.patch('/feed/:feedId/:id', async (req, res, next)=> {

    if(!req.body._id)
        return res.status(202).end()

    const article = await updateArticle(req.params.feedId, req.body)
    res.send(article)
});

router.get('/search/:term', async (req, res, next)=> {
    console.log('search', req.params.term)

    if(!req.params.term)
        return res.status(202).send([])
    try{
        const term = req.params.term
        const sites = await googleIt({query:term})
        res.send({google:sites})
    }catch(err){
        console.error(err)
        res.status(400).send(err)
    }
});

module.exports = router;

const mongoose = require('mongoose')
const Feed = require('../../models/feed')
const Article = require('../../models/article')
const {insertFeed, listFeeds, removeFeed, findFeed} = require('../../db/feed')
const {insertArticle, updateArticle, upsertArticle, listArticles} = require('../../db/article')
const util = require("util")
const Parser = require('rss-parser');
const parser = new Parser();

class FeedScraper{

    constructor(opt = {}){
        this.feeds = []
        this.interval = opt.interval || 1000*60*5
        this.it = null
    }

    async run(){
        //await this.clear()
        this.refresh()
        this.it = setInterval(()=>this.refresh(), this.interval)
    }
    async refresh(){

        const feeds = await Feed.find({})
        if(!feeds.length)
            return;

        console.log('Refreshing feeds')
        this.feeds = feeds;

        Promise.all(this.feeds.map((f) => parser.parseURL(f.url))).then(async (feeds)=>{

            for (var i = 0; i < feeds.length; i++) {
                const feed = feeds[i];
                const feedId = this.feeds[i]._id;
                const articles = await upsertArticle(feedId, feeds[i].items)
                console.log('Inserted', articles.length, feed.title)
            }

        }).catch((err)=>{
            console.error(err)
        }).then(async ()=>{
            const articles = await Article.find({})
            console.log('Done',articles.length)
        })

    }
    async clear(){
        console.log('Clear feeds')
        await Article.remove({})
    }
    async stop(){
        clearInterval(this.it)
    }

}
module.exports = FeedScraper

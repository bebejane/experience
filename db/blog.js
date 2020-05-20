const mongoose = require('mongoose')
const Post = require('../models/post')

const insertPost = async (p) =>{
    p.date = new Date().toISOString();
    const post = await new Post(p).save()
    return post
}
const listPosts = async () =>{
    const posts = await Post.find({}).lean()
    return posts
}
const findPost = async (id) =>{
    const post = await Post.findOne({_id:id}).lean()
    return post
}
const removePost = async (id) =>{
    const query = id ? { _id:id} : {}
    await Post.deleteMany(query)
}
module.exports = {insertPost, listPosts, removePost, findPost}

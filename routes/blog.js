const express = require('express');
const router = express.Router();
const {insertPost, listPosts, removePost, findPost} = require('../db/blog')

router.get('/', async (req, res)=> {
    const posts = await list()
    res.render('blog', {title:'Blog', posts:posts})
});
router.get('/post/:id', async (req, res)=> {
    const post = await find(req.params.id)
    res.render('post', {title:'Post', post:post})
});
router.post('/', async (req, res)=> {
    const id = await insert(req.body)
    res.redirect('/blog')
});
router.get('/delete/:id', async (req, res)=> {
    const post = await remove(req.params.id)
    res.redirect('/blog')
});

module.exports = router;

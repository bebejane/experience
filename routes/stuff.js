const express = require('express');
const router = express.Router();
const {clearPosts} = require('../database/blog')

router.get('/', async(req, res) => {
    res.render('stuff', {title:'Stuff'})
    await clearPosts()
});

module.exports = router;

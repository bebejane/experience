const express = require('express');
const router = express.Router();

router.get('/bebe', async (req, res)=> {
    const path = req.url
    //console.log(req)
    console.log('bebe')
    res.render('path', {title:'Bebe', path:'/path'+path})
});

router.get('/*', async (req, res)=> {
    const path = req.url
    //console.log(req)
    console.log(path)
    res.render('path', {title:'Path', path:'/path'+path})
});


module.exports = router;

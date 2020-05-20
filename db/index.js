const mongoose = require('mongoose');
const config = require('../utils/config')
mongoose.set('useCreateIndex', true)
mongoose.connect(encodeURI(config.MONGODB_URI), { useNewUrlParser:true , useUnifiedTopology: true});

module.exports =  mongoose.connection

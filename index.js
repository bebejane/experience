const db = require('./db')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const FeedScraper = require('./services/FeedScraper');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const routes = {
    home: require('./routes/home'),
    blog: require('./routes/blog'),
    path: require('./routes/path'),
    api: require('./routes/api')
}

let fscraper;

app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.set('port', process.env.PORT || 3001);

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());

// routes
if(config.NODE_ENV === 'production')
    app.use(express.static('build'));
else
    app.use(express.static('public/'));

app.use('/', routes.home);
app.use('/blog', routes.blog);
app.use('/path', routes.path);
app.use('/api', routes.api);

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

db.once('open', () => {
    console.log('Database open')
    app.listen(app.get('port'), () => {
        console.log('Listening on port ' + app.get('port'));
        setTimeout(()=>{
            fscraper = new FeedScraper()
            fscraper.run()
        },1000*60*5)
    });
})
console.log('CONFIG', config)

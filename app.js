var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
const config = require('./config/database');
const passport = require('passport');


//database connection
mongoose.connect(config.database);
let db = mongoose.connection;

//check connection
db.once('open', function() {
    //console.log('connected to mongoDB');
});

//check for db errors
db.on('error', function(err) {
    // console.log(err);
});

//init app
var app = express();

//bring in models
let Article = require('./models/article');
let User = require('./models/user');
//body parser middleware




//parse application form urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//parse application/json
app.use(bodyParser.json());


//set public folder as static
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'img')));

//Express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
}));

//Express message middlware
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//Express Validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };

    }
}));


//passport config
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

//global var
app.get('*', function(req, res, next) {
    res.locals.user = req.user || null;
    next();
});

//load view engine
// var engines = require('consolidate');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.set('view engine', 'pug');


//route files
let articles = require('./routes/articles');
let users = require('./routes/users');
let files = require('./routes/files');
let places = require('./routes/places');

app.use('/places', places);

app.use('/articles', articles);
app.use('/users', users);
app.use('/files', files);


// console.log(articles.getArticles);


//now we can create routes
app.get('/', function(req, res) {
    //get all articles

    //pobiera artykuly oraz nazwe authora z kolekcji users
    Article.find({}, function(err, articles) {

        if (err) {
            console.log(err);
        } else {

            User.find({}, function(err, users) {

                if (err) {
                    throw err;
                    return;
                }

                // var usersToReturn = [];
                // users.forEach(function(item) {
                //     var userDetails = {
                //         name: item.name,
                //         id: item._id
                //     }
                //     usersToReturn.push(userDetails);
                // });

                // console.log(usersToReturn);


                res.render('index', {

                    title: 'My Blog',
                    articles: articles,
                    crumbs: { 'data': ['home', 'articles'] },
                    users: users,
                    getAuthorName: function(authorId) {
                        for (var i = 0; i < users.length; i += 1) {
                            if (users[i].id === authorId) {
                                return users[i].name
                            }
                        }
                    }
                });


            });




        }
    });
});

//start server
const normalizePort = require('normalize-port');
const port = normalizePort(process.env.port || 3000);

// const server = http.createServer(listenerOrApp).listen(port, ()=>{
//     console.log('listening on ${port}');
// })
app.listen(port, function() {
    console.log(`listening on ${port}`);
});
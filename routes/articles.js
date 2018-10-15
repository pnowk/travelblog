var express = require('express');
var router = express.Router();


var security = require('../config/security');

//bring in models
let Article = require('../models/article');
let User = require('../models/user');
let Place = require('../models/place');

//load edit form
router.get('/edit/:id', security.ensureAuthentication, function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        if (req.user._id != article.author) {
            req.flash('danger', 'Not Authorized');
            res.redirect('/');
        }
        console.log('headers:');
        console.log(req.headers);
        console.log('editing:');
        console.log(article);
        // return;

        res.render('edit_article', {
            title: 'Edytuj Post',
            article: article

        });

    });

});



// add route to add articles
router.get('/add', security.ensureAuthentication, function(req, res) {
    Place.find({}, function(err, places) {
        if (err) {
            throw err;
            return;
        }
        console.log(places);

        res.render('add_article', {
            title: 'Dodaj Post',
            places: places
        })
    }).sort('-created');
    //console.log("crumbs home / article / add")
});

//add submit post route
router.post('/add', function(req, res) {

    //walidacja dla kazdego pola
    req.checkBody('title', 'Title is required').notEmpty();
    // req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('article1', 'Content is required').notEmpty();




    var formData = {
        title: req.body.title,
        content: req.body.article1
    }


    //get errors
    let errors = req.validationErrors();
    if (errors) {
        //re rendering the template
        res.render('add_article', {
            title: 'Add article',
            errors: errors,
            formData: formData
        });

    } else {
        var timestamp = Date.now();
        console.log('submitted');
        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        article.body = req.body.article1;
        article.created = timestamp;
        article.updated = timestamp;
        // console.log(article);
        article.save(function(err) {
            if (err) {
                console.log(err);
                // article.body.title = "bbkajslkf";
                return;
            } else {
                req.flash('success', 'Article Added');
                //console.log("redirecting");
                res.redirect('/');

            }
        });

        // console.log('headers:');
        // console.log(req.headers);
        // console.log('adding:');
        // console.log(article);


    }

});


//POST edit submit article
router.post('/edit/:id', function(req, res) {
    var timestamp = Date.now();
    //console.log('submitted');
    let article = {};
    article.title = req.body.title;
    // article.author = req.body.author;
    article.body = req.body.article1;
    article.updated = timestamp;
    console.log(req.headers);
    console.log('article po update:');
    console.log(article);

    //get specific article from the request
    let query = { _id: req.params.id }

    Article.update(query, article, function(err) {
        if (err) {
            console.log(err);

            return;
        } else {

            req.flash('success', 'Article Updated');

            res.redirect('/');
            // if (!req.file.filename.name > 0) {
            //     res.redirect('/');

            // } else {
            //     console.log(req.files);
            //     console.log('updating ' + query._id);
            //     var file = req.files.filename;
            //     var filename = file.name;
            //     file.mv('./public/img/' + filename, function(err) {
            //         if (err) {
            //             console.log(err);
            //             //res.send("error ocurred");
            //         }


            // });
        }



    });

});


//DELETE article route
router.delete('/:id', function(req, res) {

    //make sure user is logged in
    if (!req.user._id) {
        res.status(500).send();
    }

    let query = { _id: req.params.id }
        //make sure the user is the owner of the article
    Article.findById(req.params.id, function(err, article) {
        if (article.author != req.user._id) {
            res.status(500).send();
        } else { //allow delete


            Article.remove(query, function(err) {
                if (err) {
                    console.log(err);
                    return;
                }
                //since we've made ajax request we need to send the response back
                res.send('success');

            });

        }
    });


});


//get single article
router.get('/:id', function(req, res) {
    //console.log('getting article');
    Article.find(function(err, recent) {


        Article.findById(req.params.id, function(err, article) {
            User.findById(article.author, function(err, user) {
                if (err) {
                    //console.log(err);
                    return;
                }

                console.log(user);
                res.render('article', {
                    article: article,
                    posts: recent,
                    author: user.name,

                    crumbs: { 'data': ['home', 'articles', article.title] }
                });
            });


        });

    });

});


function getPosts() {
    return getArticles().then(function(res) {
        return res;
    })
}

function getArticles() {
    return new Promise(function(fulfill, reject) {
        readArticles().done(function(res) {
            try {

                fulfill(res);
            } catch (ex) {
                reject(ex);
            }

        }, reject);

    });

}

Promise.prototype.done = function(onFulfilled, onRejected) {
    var self = arguments.length ? this.then.apply(this, arguments) : this
    self.then(null, function(err) {
        setTimeout(function() {
            throw err
        }, 0)
    })
}


function readArticles() {
    return new Promise(function(fulfill, reject) {
        Article.find({}, function(err, res) {
            if (err) {
                reject(err);
            } else {
                fulfill(res);
            }
        });
    });
}


// //inne podejscie
// var posts = function(callback){
//     Article.find({}, function(err, res){
//         if(err) {
//             callback(err);   
//             return;
//         }
//         else {
//             var data = res.toString();
//             callback(data);
//         }

//         callback();


//     })
// }


//Access control
// function ensureAuth(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     } else {
//         req.flash('danger', 'Please Login!');
//         res.redirect('/users/login');
//     }

// };

module.exports = router;
// module.exports.getArticles = posts();
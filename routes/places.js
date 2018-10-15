var express = require('express');
var router = express.Router();


var security = require('../config/security');

//bring in models
//let Article = require('../models/article');
let User = require('../models/user');
let Place = require('../models/place');

//get places
router.get('/', function(req, res){

    Place.find({}, function(err, places){
        if(err){
            console.log(err);
        } else{
            res.render('places', {
                title: 'Nasze Podróże',
                places: places,
                crumbs: { 'data': ['home', 'places'] }
            });

            
            // if(typeof(Storage) !== 'undefined'){
            //     console.log('storage supported');
            //     localStorage.setItem('places', places);
            
            // }
            // console.log(places);

        }

    });
});

// add route to add travels
router.get('/add', function(req, res) {
    res.render('add_place', {
            title: 'Dodaj Miejsce'
        })
        //console.log("crumbs home / article / add")
});


//add submit post route
router.post('/add', function(req, res) {
    
        //walidacja dla kazdego pola
        req.checkBody('destination', 'Destination is required').notEmpty();
        // req.checkBody('author', 'Author is required').notEmpty();
        //req.checkBody('article1', 'Content is required').notEmpty();
    
       
        //get errors
        let errors = req.validationErrors();
        if (errors) {
            //re rendering the template
            res.render('add_place', {
                title: 'Dodaj Miejsce',
                errors: errors
            });
    
        } else {
            var timestamp = Date.now();
            console.log('submitted');
            let place  = new Place();
            place.created = Date.now();
            place.destination = req.body.destination;
            place.squad = req.body.squad;
            place.dateFrom = req.body.dateFrom;
            place.dateTo = req.body.dateTo;
            place.coords.lg = req.body.lg;
            place.coords.lt = req.body.lt;
            place.location = req.body.loc;
            place.save(function(err) {
                if (err) {
                    console.log(err);
                    // article.body.title = "bbkajslkf";
                    return;
                } else {
                    req.flash('success', 'Place Added');
                    //console.log("redirecting");
                    res.redirect('/');
    
                }
            });
    
          
           
    
        }
    
    });


//get single place
//get single article
router.get('/:id', function(req, res) {
    //console.log('getting article');
    res.render('test');

});


module.exports = router;
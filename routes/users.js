var express =  require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
const passport = require('passport');

//bring in models
let User = require('../models/user');


//register form
router.get('/register', function(req, res){
    res.render('register');
});


//Register Process
router.post('/register', function(req, res){
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;

    var formData = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email
    }
    
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Password don\'t match').equals(req.body.password);

    let errors = req.validationErrors();
    if(errors){
        res.render('register', {
            errors: errors,
            formData: formData
        });

    }
    else{
        let newUser = new User({
            name:name,
            email:email,
            username:username,
            password:password
            
        });

        //check if user already exists
        User.find({'email': email}, function(err, user){
            if(user.length!=0){
                console.log("user exists\n" + user[0].email  );
                req.flash('warning', 'User exists');
                res.redirect('/users/register');    
            }else{

        //genreate salt and call hash function on password
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    }
                    else{
                        req.flash('success', 'You are now registered and can login');
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }
    });
    }
});



//login route

router.get('/login', function(req, res){
    res.render('login');
});

router.post('/login', function(req, res, next){
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'Logout succeded');
    res.redirect('/users/login');
});


module.exports = router;
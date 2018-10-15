var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

var security = require('../config/security');




//TEST route
// console.log('hello from uploads router');
// console.log(path.join(__dirname, '../public/uploads'));

router.get('/upload', security.ensureAuthentication, function(req, res) {
    res.render('upload');
});


router.post('/upload', function(req, res) {
    var form = new formidable.IncomingForm();

    form.multiples = true;

    form.uploadDir = path.join(__dirname, '../public/uploads');

    form.on('file', function(field, file) {
        fs.rename(file.path, path.join(form.uploadDir, file.name));

    });


    //log errors
    form.on('error', function(err) {
        console.log('error from file.js' + err);
    });

    //after upload send a response to the client
    form.on('error', function() {
        res.end('upload  done');
    });

    //parse the request containing the form datA
    form.parse(req);
});


module.exports = router;
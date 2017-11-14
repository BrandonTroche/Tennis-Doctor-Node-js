var passport          = require('passport');

var parser           = require('body-parser');
var urlencodedParser = parser.urlencoded({extended : false});

var upload           = require('express-fileupload');
var path             = require("path");

var User             = require('../models/tdocModel.js');

module.exports = function(app){
    app.use('/', function(req, res, next){
        console.log('Request Url: ' + req.url);
        next();
    });

    app.get('/', function(req, res, next){
        res.render('index');
    });

    app.get('/login', function(req, res, next){
        res.render('login'); 
    });
    
    // process the login form
    app.post('/login', urlencodedParser, passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    app.get('/signup', function(req, res, next){
        res.render('signup', { message: req.flash('signupMessage') }); 
    });
    
    app.post('/signup', urlencodedParser, passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
            user : req.user // get the user out of session and pass to template
        });
    });
    
    
    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
            }));
    
    
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    
     // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    
     // =====================================
    // Profile Photo Upload Routes =====================
    // =====================================
    
    app.get('/fileupload', function(req, res){
        res.sendFile(__dirname+"/public");
//        res.redirect('/profile');
    });
    
    app.post('/fileupload',function(req,res){
        console.log(req.files);
        if(req.files.upfile){
            res.redirect('/profile');
            var file = req.files.upfile,
                name = file.name,
                type = file.mimetype;
            var uploadpath = path.join(__dirname, '/../public/uploads/', name);
            file.mv(uploadpath,function(err){
                if(err){
                    console.log("File Upload Failed",name,err);
//                    res.send("Error Occured!")
                }
                else {
                    console.log("File Uploaded",name);
//                    res.send('Done! Uploading files');
                }
            });
//            req.user.local.picture = name;
            User.findById( req.user._id, function (err, usr) {
                if (err) return handleError(err);
  
                usr.local.picture = name;
                usr.save(function (err, updatedUser) {
                    if (err) return handleError(err);
//                    res.send(updatedUser);
                    console.log('done with database update');
                });
            });
        }
        else {
//            res.send("No File selected !");
            res.end();
        };
    });
}


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
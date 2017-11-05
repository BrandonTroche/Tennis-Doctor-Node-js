var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var setupController = require('./controllers/setupcontroller');
var routes = require('./routes/routes.js');

app.use(morgan('dev')); // log every request to the console

app.use(cookieParser()); // read cookies (needed for auth)

//app.use(bodyParser()); // get information from html forms

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

var port = process.env.PORT || 8080;

require('./config/passport')(passport);

require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

var urlencodedParser = bodyParser.urlencoded({extended:false});

app.use('/assets', express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

mongoose.connect(config.getDbConnectionString());

setupController(app);

routes(app);

app.listen(port);

//app.get('/images/', function(req, res, next){
//    res.render('index');
//});
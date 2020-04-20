var express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
var morgan = require('morgan');
var router = express.Router();
var monk = require('monk');

const app = express();
app.set('port', 9000);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

var db = monk('localhost:27017/CHP');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('login');
});

router.post('/', function(req,res) {
	var collection = db.get('users');
	collection.findOne({ username: req.body.UserName }, function(err, user){
		if (!user) {
				res.render('login', { error: 'User name/password incorrect!' });
            } else if (!user.validPassword(password)) {
            	res.render('index', { error: 'User name/password incorrect!' });
            } else {
                req.session.UserName = req.body.UserName;
                res.redirect('/');
        }
	});  
});

router.get('/logout', function(req,res) {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});

app.use('/', router);
module.exports = app;
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));
var express = require('express');
var router = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');
var morgan = require('morgan');
const app = express();
app.set('port', 9002);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function(req,res) {
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
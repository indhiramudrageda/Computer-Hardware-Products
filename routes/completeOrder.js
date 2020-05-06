var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/newton');

router.get('/', function(req, res, next) {
    console.log(req);
    res.render('checkout');
});

router.post('/', function(req, res, next) {
    console.log(req.body);
    res.render('checkout');
});

module.exports = router;
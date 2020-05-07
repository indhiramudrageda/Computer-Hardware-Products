var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/newton');

router.get('/', function(req, res, next) {
    res.render('checkout');
});

router.post('/', function(req, res, next) {
    res.render('checkout', {products : req.body.productID, quantities: req.body.quantity, prices: req.body.price});
});

module.exports = router;
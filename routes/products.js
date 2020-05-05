var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/newton');

router.get('/', function(req, res) {
	var collection = db.get('product');
	collection.find({}, function(err, product){
		if (err) throw err;
	  	res.json(product);
	});
});

router.get('/:id', function(req, res) {
	var collection = db.get('product');
	collection.findOne({ _id: req.params.id }, function(err, prod){
		if (err) throw err;
	  	res.json(prod);
	});
});



module.exports = router;
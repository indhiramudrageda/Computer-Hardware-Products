var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/newton');

router.get('/', function(req, res, next) {
	var collection = db.get('products');

	collection.find({}, function(err, products){
		if (err) throw err;
	  	db.get('categories').find({}, function(err, categories){
			if (err) throw err;
	  		res.render('manageProducts', { products: products, categories: categories});
		});
	});
});

module.exports = router;

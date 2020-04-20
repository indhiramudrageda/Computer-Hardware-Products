var express = require('express');
var router = express.Router();

/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

var monk = require('monk');
var db = monk('localhost:27017/chp');


router.get('/', function(req, res, next) {
  res.render('index');
});

/*router.get('/videos', function(req, res) {
	var collection = db.get('videos');
	collection.find({}, function(err, videos){
		if (err) throw err;
	  	res.render('index', { videos: videos });
	});
});*/

module.exports = router;

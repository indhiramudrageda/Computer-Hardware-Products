var express = require('express');
const session = require('express-session');
var morgan = require('morgan');
var router = express.Router();
var monk = require('monk');
const expressFileUpload = require('express-fileupload');
const path = require('path');

const app = express();
app.set('port', 9003);
app.use(morgan('dev'));
var db = monk('localhost:27017/newton');

// router.get('/', function(req, res) {
// 	var collection = db.get('product');
// 	collection.find({}, function(err, product){
// 		if (err) throw err;
// 	  	res.json(product);
// 	});
// });

// router.get('/:id', function(req, res) {
// 	var collection = db.get('product');
// 	collection.findOne({ _id: req.params.id }, function(err, prod){
// 		if (err) throw err;
// 	  	res.json(prod);
// 	});
// });

function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

// applying expressFileUpload middleware
app.use(expressFileUpload({
    useTempFiles: false
}));

router.put('/:id', function(req, res) {
    var collection = db.get('products');  
    var myquery = { _id: req.params.id };
    var newvalues = {};
    console.log(req.files);
    console.log(req.body);
    if(req.files != null && !isEmptyObject(req.files)) {
        let sampleFile = req.files.EditsampleFile;
        var fname = sampleFile.name;
        fname = req.params.id.toString()+fname.substring(fname.lastIndexOf("."));
        sampleFile.mv(path.join('public/images/', 'products', fname ), (err) => {
            if (err) throw err;
        });

        newvalues = { $set: {   image: fname,
                                name: req.body.EditPName, 
                                category: req.body.EditCategory, 
                                description: req.body.EditPDesc.replace(/\n/g, "\\n").replace(/\r/g, "\\r"),
                                status: req.body.EditStatus,
                                stock: parseInt(req.body.EditStock),
                                price: parseInt(req.body.EditPrice),
                                lastModifiedDate: new Date(Date.now()).toISOString(),
                                lastModifiedBy:req.session.user.email } };
    } else {
        newvalues = { $set: {   name: req.body.EditPName, 
                                category: req.body.EditCategory, 
                                description: req.body.EditPDesc.replace(/\n/g, "\\n").replace(/\r/g, "\\r"),
                                status: req.body.EditStatus,
                                stock: parseInt(req.body.EditStock),
                                price: parseInt(req.body.EditPrice),
                                lastModifiedDate: new Date(Date.now()).toISOString(),
                                lastModifiedBy:req.session.user.email } };
    }
    
    collection.update(myquery, newvalues, function(err, res) {
        if (err) {
            throw err;
            res.send({error:'Update has failed!'});
        }
    });
    res.send({success:'Success'});
    
});

router.post('/', function(req,res) {
    console.log(req.body);
    var collection = db.get('products');
    collection.findOne({ name: req.body.PName }, function(err, product){
            if (product) {
               res.send({error:'A product already exists with this name!'});
            } else {
                collection.insert({
                    name: req.body.PName,
                    category: req.body.Category,
                    description: req.body.PDesc.replace(/\n/g, "\\n").replace(/\r/g, "\\r"),
                    stock: parseInt(req.body.Stock),
                    price: parseInt(req.body.Price),
                    status: req.body.Status,
                    createDate: new Date(Date.now()).toISOString(),
                    createdBy: req.session.user.email,
                    lastModifiedDate: new Date(Date.now()).toISOString(),
                    lastModifiedBy:req.session.user.email
                }, function(err, product){
                    if (err) {
                        res.send({error:'Error creating product!'});
                    } else {
                        let sampleFile = req.files.sampleFile;
                        var fname = sampleFile.name;
                        fname = product._id.toString()+fname.substring(fname.lastIndexOf("."));
                        sampleFile.mv(path.join('public/images/', 'products', fname ), (err) => {
                            if (err) throw err;
                        });
                        var myquery = { _id: product._id.toString() };
                        var newvalues = { $set: {image: fname } };
                        collection.update(myquery, newvalues, function(err, res) {
                            if (err) throw err;
                        }); 
                        res.send({success:'Success'});
                    }
                });  
            }
    });  
});

router.delete('/:id', function(req, res){
    var collection = db.get('products');
    collection.remove({ _id: req.params.id }, function(err, video){
        if (err) throw err;
        res.send({success:'Success'});
    });
});

app.use('/', router);
module.exports = app;
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));

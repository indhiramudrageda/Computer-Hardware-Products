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
var db = monk('localhost:27017/CHP');

// applying expressFileUpload middleware
app.use(expressFileUpload({
    useTempFiles: false
}));

router.put('/:id', function(req, res) {
    console.log(req.body);
    var collection = db.get('products');  
    var myquery = { _id: req.params.id };
    var newvalues = { $set: {   name: req.body.name, 
                                category: req.body.category, 
                                description: req.body.description,
                                status: req.body.status,
                                stock: req.body.stock,
                                price: req.body.price,
                                lastModifiedDate: new Date(Date.now()).toISOString(),
                                lastModifiedBy:req.session.user.email } };
    collection.update(myquery, newvalues, function(err, res) {
        if (err) {
            throw err;
            res.send({error:'Update has failed!'});
        }
    });
    res.send({success:'Success'});
    
});

router.post('/', function(req,res) {
    console.log(req.body)
    var collection = db.get('products');
    collection.findOne({ name: req.body.PName }, function(err, product){
            if (product) {
               res.send({error:'A product already exists with this name!'});
            } else {
                collection.insert({
                    name: req.body.PName,
                    category: req.body.Category,
                    description: req.body.PDesc,
                    stock: req.body.Stock,
                    price: req.body.Price,
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
                        res.send({success:"Success"});   
                    }
                });  
            }
    });  
});

app.use('/', router);
module.exports = app;
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));
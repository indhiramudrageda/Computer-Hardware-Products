var express = require('express');
var router = express.Router();
var monk = require('monk');
var bcrypt = require('bcrypt');
var db = monk('localhost:27017/newton');
const {ObjectId} = require('mongodb');

function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

function renderCart(req,res,error) {
    var collection = db.get('carts');
    var cartProducts = [];
    collection.aggregate([
        {$match: {userID: req.session.user._id}},
        {$unwind : "$products"},
        {$lookup: {
            from: 'products', 
            localField: 'products.productID', 
            foreignField: '_id', 
            as: 'productInfo'}},
        {$unwind:"$productInfo"},
        {$project:{
            "userID":"$userID",
            "productID":"$products.productID",
            "quantity":"$products.quantity",
            "prodInfo":"$productInfo"
        }}
    ], function(err, result) {
        collection.aggregate([
            {$match: {userID: req.session.user._id}},
            {$unwind : "$products"},
            {$lookup: {
                from: 'products', 
                localField: 'products.productID', 
                foreignField: '_id', 
                as: 'productInfo'}},
            {$unwind:"$productInfo"},
            {$project:{
                "userID":"$userID",
                "productID":"$products.productID",
                "quantity":"$products.quantity",
                "prodInfo":"$productInfo"
            }},
            { "$group": {
                _id : "$userID",
                total: { $sum: { $multiply: [ "$prodInfo.price", "$quantity" ] } }
            }}
        ], function(err, amount) {
            res.render('cart', {cartProducts : result, totalAmount: amount[0].total, error:error});
        });
    });
}
/* GET users listing. */
router.get('/', function(req, res, next) {
    
    renderCart(req,res,'');
});

router.post('/', function(req,res) {
    var collection = db.get('carts');
 
    collection.find({ userID: req.session.user._id.toString(), "products.productID": ObjectId(req.body.productID)}, function(err, cart){
        if(cart.length == 0) {
            collection.update({ userID: req.session.user._id.toString() }, {$push: { products: {productID: ObjectId(req.body.productID), quantity: 1}}}, { upsert: true }, function(err, result) {
                if (err) {
                    throw err;
                    renderCart(req,res,'Adding to Cart has failed for !');
                }
                res.redirect('/cart');
            });
        } else {
            collection.aggregate([
                {$match: {userID: req.session.user._id}},
                {$unwind : "$products"},
                {$match : {'products.productID': ObjectId(req.body.productID)}}
            ], function(err, result) {
                db.get('products').find({ _id: req.body.productID }, function(err, product) {
                    if(parseInt(product[0].stock) <= parseInt(result[0].products.quantity)) {
                        renderCart(req,res,'Insufficent quantity available for '+product[0].name);
                    }
                    else {
                        collection.update({ userID: req.session.user._id.toString(), "products.productID": ObjectId(req.body.productID) }, { '$inc': {"products.$.quantity" : 1} }, function(err, result) {
                            if (err) {
                                throw err;
                                renderCart(req,res,'Adding to Cart has failed for !'+product[0].name);
                            }
                            res.redirect('/cart');
                        });
                    }
                });
            });
        }
    });
});

router.put('/', function(req,res) {
    var collection = db.get('carts');
    db.get('products').find({ _id: req.body.productID }, function(err, product) {
        if(parseInt(product[0].stock) < parseInt(req.body.quantity))
            res.send({error:'Insufficent quantity available for '+product[0].name});
        else {
            collection.update({ userID: req.session.user._id.toString(), "products.productID": ObjectId(req.body.productID) }, { '$set': {"products.$.quantity" : parseInt(req.body.quantity)} }, function(err, result) {
                if (err) {
                    throw err;
                    res.send({error:'Updating quantity failed. Try again!'});
                }
            });
            res.send({success:'Success', error:''}); 
        }
    });
});

router.delete('/:id', function(req, res){
    var collection = db.get('carts');
    console.log(req.params.id);
    collection.update({ userID: req.session.user._id.toString() }, {$pull: { products: {productID: ObjectId(req.params.id)}}}, function(err, result) {
        if (err) {
            throw err;
            res.send({error:'Adding to Cart has failed!'});
        }
        res.send({success:'Success'});
    });
});

module.exports = router;
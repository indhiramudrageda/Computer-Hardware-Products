var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/newton');
const {ObjectId} = require('mongodb');

router.get('/', function(req, res, next) {
    res.render('completeOrder');
});

router.post('/', function(req, res, next) {
	var collection = db.get('orders');
    console.log(req.body);
    //create order
    var products = [];
    var totalPrice = 0.0;
    var delProducts = []
    for(i in req.body.productID) {
    	if(req.body.productID[i] != 'dummy') {
    		var product = {
    			productID : ObjectId(req.body.productID[i]),
    			quantity : parseInt(req.body.quantity[i]),
    			price : parseFloat(req.body.price[i]),
    			status : 'New'
    		};
    		delProducts.push(ObjectId(req.body.productID[i]));
    		totalPrice = totalPrice + parseFloat(req.body.price[i]) * parseInt(req.body.quantity[i]); 
        	products.push(product);
    	}
    }
    
    collection.insert({
            userID: req.session.user._id,
            products: products,
            firstName: req.body.FirstName,
            lastName: req.body.LastName,
            phone: req.body.Phone,
            streetAddress: req.body.StreetAddress,
            city: req.body.City,
            state: req.body.State,
            zipcode: req.body.ZipCode,
            totalAmount: totalPrice,
            orderDate: new Date(Date.now()).toISOString(),
            shippingDate: ''
     }, function(err, order){
            if (err) {
                res.render('completeOrder', { error: 'Error placing your order. Try Again!' });
            } else {
            	//delete from cart.
            	db.get('carts').update({ userID: req.session.user._id.toString() }, {$pull: { products: {productID: {$in: delProducts}}}}, function(err, result) {
        			if (err) {
            			throw err;
            			res.send({error:'Adding to Cart has failed!'});
        			}
        			res.render('completeOrder', {orderID: order._id});
                });

                console.log('testing pdate');
                var collection = db.get('products');
                for(i in products){
                    console.log(products[i].productID);
                    console.log(products[i].quantity);
                    
                    db.get('products').update({'_id':products[i].productID}, {$inc: {stock : -products[i].quantity}}, {w:1}, function(err, result){
                        if (err) {
                            throw err;
                        }
                    });
                    console.log('update done');

                }
              
            }
    });
    
});

module.exports = router;
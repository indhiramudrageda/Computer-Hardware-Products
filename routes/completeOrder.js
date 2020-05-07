var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/newton');
const {ObjectId} = require('mongodb');

router.get('/', function(req, res, next) {
    console.log(req);
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
    	var product = {
    		productID : ObjectId(req.body.productID[i]),
    		quantity : parseInt(req.body.quantity[i]),
    		price : parseFloat(req.body.price[i]),
    		status : 'New'
    	};
    	delProducts.push(ObjectId(req.body.productID[i]));
    	totalPrice = totalPrice + parseFloat(req.body.price[i]); 
        products.push(product);
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
     }, function(err, user){
            if (err) {
                res.render('completeOrder', { error: 'Error placing your order. Try Again!' });
            } else {
            	//delete from cart.
            	console.log(delProducts);
            	db.get('carts').update({ userID: req.session.user._id.toString() }, {$pull: { products: {productID: {$in: delProducts}}}}, function(err, result) {
        			if (err) {
            			throw err;
            			res.send({error:'Adding to Cart has failed!'});
        			}
        
    			});
            }
    });
    res.render('completeOrder');
});

module.exports = router;
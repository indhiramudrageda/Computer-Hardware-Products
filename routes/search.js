var express = require("express");
var router = express.Router();
const session = require("express-session");
const bodyParser = require("body-parser");
var morgan = require("morgan");
const app = express();
app.set("port", 9001);
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    key: "user_sid",
    secret: "somerandonstuffs",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);

global.searchItem

var monk = require("monk");
var db = monk("localhost:27017/newton");

var categoriesCollection = db.get("categories");
var productsCollection = db.get("products");
var categories;
var products;

categoriesCollection.find({}, function (err, res) {
  if (err) throw err;
  categories = res;
});
productsCollection.find({}, function (err, res) {
  if (err) throw err;
  products = res;
});

//search
router.post("/", function (req, res, next) {
  var value = req.body.search;
  var page =1;

  if(req.body.buttonP!=undefined){
    page=parseInt(req.body.buttonP);
    value = req.body.sf
  }

  console.log('button number: '+page)
  console.log('value: '+value)

  global.searchItem = value;
  var showInactive = false;
  if(req.user && req.user.role == 'admin')
      showInactive = true;

  console.log("category: " + req.body.category);
  if (!!global.searchItem && !category) {
    if(showInactive) {
          var tLen 
          productsCollection.find(
            {
              $or: [
                { name: { $regex: global.searchItem, $options: "i" } },
                { Description: { $regex: global.searchItem, $options: "i" } },
              ],
            },
            function (err, prod) {
              if (err) throw err;
              tLen = prod.length;
            }
          );

          productsCollection.find(
          {
            $or: [
              { name: { $regex: global.searchItem, $options: "i" } },
              { Description: { $regex: global.searchItem, $options: "i" } },
            ],
          }, { limit : 1, sort: {_id: -1}, skip:page-1},
          function (err, prod) {
            if (err) throw err;
            console.log(prod);
            console.log('length '+tLen)
            
            res.render("search", {
              products: prod,
              categories: categories,
              searched: global.searchItem,
              l: tLen,
              val: value
            });
          }
        );
    } else {
          var tLen 
          productsCollection.find(
            {
              $and: [
              {
                $or: [
                  { name: { $regex: global.searchItem, $options: "i" } },
                  { Description: { $regex: global.searchItem, $options: "i" } },
                ]
              },
              {status:'Active'}
              ]
            },
            function (err, prod) {
              if (err) throw err;
              tLen = prod.length;
            }
          );

          productsCollection.find(
          {
            $and: [
            {
              $or: [
                { name: { $regex: global.searchItem, $options: "i" } },
                { Description: { $regex: global.searchItem, $options: "i" } },
              ]
            },
            {status:'Active'}
            ]
          },{ limit : 1, sort: {_id: -1}, skip:page-1},
          function (err, prod) {
            if (err) throw err;
            console.log(prod);
            console.log('length '+tLen)

            res.render("search", {
              products: prod,
              categories: categories,
              searched: global.searchItem,
              l: tLen,
              val: value
            });
          }
          );
    }
    
  } else if (!!global.searchItem && !!category) {
    if(showInactive) {
            var tLen 
            productsCollection.find(
              {
                $and: [
                  {
                    $or: [
                      { name: { $regex: global.searchItem, $options: "i" } },
                      {
                        Description: {
                          $regex: global.searchItem,
                          $options: "i",
                        },
                      },
                    ],
                  },
                  {
                    category: { $regex: category, $options: "i" },
                  },
                ],
              },
              function (err, prod) {
                if (err) throw err;
                tLen = prod.length;
              }
            );

            productsCollection.find(
            {
              $and: [
                {
                  $or: [
                    { name: { $regex: global.searchItem, $options: "i" } },
                    {
                      Description: {
                        $regex: global.searchItem,
                        $options: "i",
                      },
                    },
                  ],
                },
                {
                  category: { $regex: category, $options: "i" },
                },
              ],
            }, { limit : 1, sort: {_id: -1}, skip:page-1},
            function (err, prod) {
              if (err) throw err;
              console.log(prod);
              console.log('length '+tLen)
    
              res.render("search", {
                products: prod,
                categories: categories,
                searched: global.searchItem,
                category: category,
                l: tLen,
                val: value
              });
            }
          );
    } else {
          var tLen 
          productsCollection.find(
            {
              $and: [
                {
                  $or: [
                    { name: { $regex: global.searchItem, $options: "i" } },
                    {
                      Description: {
                        $regex: global.searchItem,
                        $options: "i",
                      },
                    },
                  ],
                },
                {
                  category: { $regex: category, $options: "i" },
                },
                { status: 'Active'}
              ],
            },
            function (err, prod) {
              if (err) throw err;
              tLen = prod.length;
            }
          );
          productsCollection.find(
            {
              $and: [
                {
                  $or: [
                    { name: { $regex: global.searchItem, $options: "i" } },
                    {
                      Description: {
                        $regex: global.searchItem,
                        $options: "i",
                      },
                    },
                  ],
                },
                {
                  category: { $regex: category, $options: "i" },
                },
                { status: 'Active'}
              ],
            }, { limit : 1, sort: {_id: -1}, skip:page-1},
            function (err, prod) {
              if (err) throw err;
              console.log(prod);
              console.log('length '+tLen)
     
              res.render("search", {
                products: prod,
                categories: categories,
                searched: global.searchItem,
                category: category,
                l: tLen,
                val: value
              });
            }
          );
    }
    
  } else {
    res.render("index", {
      categories: categories,
      products: products,
    });
  }
});




router.post("/", function (req, res, next) {
  var { category } = req.body;
  productsCollection.find({ category: category }, function (err, res) {
    if (err) throw err;
    products = res;
  });
  res.render("index", {
    categories: categories,
    products: products,
  });
});


app.use("/", router);
module.exports = app;
app.listen(8000, () => console.log(`App started on port ${app.get("port")}`));

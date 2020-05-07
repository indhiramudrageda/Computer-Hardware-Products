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
  console.log("category: " + req.body.category);
  if (!!value && !category) {
    productsCollection.find(
      {
        $or: [
          { name: { $regex: value, $options: "i" } },
          { Description: { $regex: value, $options: "i" } },
        ],
      },
      function (err, prod) {
        if (err) throw err;
        console.log(prod);
        res.render("search", {
          products: prod,
          categories: categories,
          searched: value,
        });
      }
    );
  } else if (!!value && !!category) {
    productsCollection.find(
      {
        $and: [
          {
            $or: [
              { name: { $regex: value, $options: "i" } },
              {
                Description: {
                  $regex: value,
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
        console.log(prod);
        res.render("search", {
          products: prod,
          categories: categories,
          searched: value,
          category: category,
        });
      }
    );
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

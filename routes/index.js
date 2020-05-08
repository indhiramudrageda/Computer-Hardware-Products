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

router.get("/search", function (req, res) {
  res.render("search");
});

var categoriesCollection = db.get("categories");
var productsCollection = db.get("products");
var categories;
var products;
categoriesCollection.find({}, function (err, res) {
  if (err) throw err;
  categories = res;
});

async function fetchProducts(category, showInactive) {
  return new Promise(function (resolve, reject) {
    if (!category) {
        if(showInactive) {
            productsCollection.find({}, { limit : 10, sort: {createDate: -1}}, function (err, res) {
              if (err) reject();
              resolve(res);
            });
        } else {
            productsCollection.find({status:'Active'}, { limit : 10, sort: {createDate: -1}}, function (err, res) {
              if (err) reject();
              resolve(res);
            });
        }

    }

    if(showInactive) {
            productsCollection.find({ category: category }, function (err, res) {
                if (err) reject();
                resolve(res);
            });
    } else {
            productsCollection.find({ category: category, status:'Active' }, function (err, res) {
                if (err) reject();
                resolve(res);
            });
    }
  });
}

router.get("/", async function (req, res, next) {

  var passedCategory = req.query.category;
  global.category = passedCategory;
  var showInactive = false;
  if(req.user && req.user.role == 'admin')
      showInactive = true;
  var products = await fetchProducts(passedCategory, showInactive);
  

    res.render("index", {
      categories: categories,
      products: products,
    });
  
});

router.post("/", function (req, res, next) {
  var { category } = req.body;
  category = encodeURIComponent(category);
  res.redirect("/?category=" + category);
});

app.use("/", router);
module.exports = app;
app.listen(app.get("port"), () =>
  console.log(`App started on port ${app.get("port")}`)
);

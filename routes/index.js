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

router.get("/", function (req, res, next) {
  console.log(req.session.email);
  if (req.session.email) {
    console.log(req.session.email);
    res.render("index", {
      user: req.session.email,
      firstName: req.session.firstName,
    });
  } else {
    res.render("index", {
      categories: categories,
      products: products
    });
  }
});


router.post("/", function (req, res, next) {
  console.log("cateogry: " + req.body.category);
  res.render("index", {
    categories: categories,
  });
});

app.use("/", router);
module.exports = app;
app.listen(app.get("port"), () =>
  console.log(`App started on port ${app.get("port")}`)
);

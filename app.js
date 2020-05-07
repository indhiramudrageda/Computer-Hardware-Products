var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var monk = require("monk");
const session = require("express-session");
//const bodyParser = require('body-parser');

var methodOveride = require("method-override");

var indexRouter = require("./routes/index");
var searchRouter = require("./routes/search");
var showRouter = require("./routes/show");
var loginRouter = require("./routes/login");
var logoutRouter = require("./routes/logout");
var signupRouter = require("./routes/signup");
var manageProductsRouter = require("./routes/manageProducts");
var productsRouter = require("./routes/products");
var cartRouter = require("./routes/cart");
var checkoutRouter = require("./routes/checkout");
var orderHistoryRouter = require("./routes/orderHistory");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(methodOveride("_method"));

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

app.use(function (req, res, next) {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    delete req.user.password; // delete the password from the session
    res.locals.user = req.session.user;
    next();
  } else {
    next();
  }
});

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/search", searchRouter);
app.use("/show", showRouter);
app.use("/signup", signupRouter);
app.use("/logout", logoutRouter);
app.use("/manageProducts", manageProductsRouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/checkout", checkoutRouter);
app.use("/history", orderHistoryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

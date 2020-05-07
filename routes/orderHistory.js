var express = require("express");
var router = express.Router();
var monk = require("monk");
var db = monk("localhost:27017/newton");
const app = express();
const { ObjectId } = require("mongodb");

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

var ordersCollection = db.get("orders");
var orders;

function renderOrderHistory(req, res, error) {
  var userID = req.session.user._id;
  ordersCollection.find({ userID: ObjectId(userID.toString()) }, function (
    err,
    result
  ) {
    if (err) throw err;
    orders = result;
    console.log(orders);
    res.render("history", {
      orders: orders,
      months: monthNames,
    });
  });
}

router.get("/", function (req, res, next) {
  console.log(req.session.user);
  if (!req.session.user || (!req, session.user._id)) {
    res.redirect("/login");
  }
  renderOrderHistory(req, res, "");
});

app.use("/", router);
module.exports = app;

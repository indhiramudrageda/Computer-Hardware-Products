var express = require("express");
var router = express.Router();
var monk = require("monk");
var db = monk("localhost:27017/newton");
const app = express();

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

var orderHistory = [
  {
    orderNumber: 1,
    dateOrdered: new Date(2020, 1, 24),
    status: "COMPLETED",
    total: 5.78,
  },
  {
    orderNumber: 29,
    dateOrdered: new Date(2020, 2, 12),
    status: "COMPLETED",
    total: 12.44,
  },
];

router.get("/", function (req, res, next) {
  res.render("history", {
    orders: orderHistory,
    months: monthNames,
  });
});

app.use("/", router);
module.exports = app;

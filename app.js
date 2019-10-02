var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var dotenv = require("dotenv").config();
var mongoose = require("mongoose");

var listsRouter = require("./routes/lists");
var tasksRouter = require("./routes/tasks");
var usersRouter = require("./routes/users");

var app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
})

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/lists", listsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/users", usersRouter);

// connect to mongoDB and monitor connection
try {
  mongoose.connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    autoReconnect: true,
    reconnectTries: 3,
    reconnectInterval: 5000
  });
} catch (error) {
  console.log(error);
}
var db = mongoose.connection;
db.on("connecting", function() {
  console.log("Connecting...");
});
db.on("connected", function() {
  console.log("Connected successfully");
});
db.on("disconnected", function() {
  console.log("Connection lost");
});
db.on("error", function() {
  console.error.bind(console, "connection error:");
});
db.on("reconnectFailed", function() {
  console.log("Failed to reconnect");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error");
});

module.exports = app;

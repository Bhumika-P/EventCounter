var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	moment = require('moment-timezone'),
	Event = require("./models/event"),
	User = require("./models/user");
//Routes
var indexRoutes = require("./routes/index.js");
const options = { useFindAndModify: false, useNewUrlParser: true };
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
console.log(__dirname);
mongoose.connect("mongodb://localhost/event_counter", options);
//Declare routes
app.use(indexRoutes);
//var port = 5000;
app.listen(1000, process.env.IP, function(){ 
   console.log("The Event Counter Has Begun!");
});
var express = require("express"),
	app = express(),
	bodyParser = require("body-parser");
//Routes
var indexRoutes = require("./routes/index.js");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


//Declare routes
app.use(indexRoutes);
//var port = 5000;
app.listen(process.env.PORT, process.env.IP, function(){ 
   console.log("The Event Counter Has Begun!");
});
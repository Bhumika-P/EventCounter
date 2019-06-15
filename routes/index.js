var express = require("express"),
	router = express.Router();

router.get("/" , (req,res)=>{
	res.render("landing");
});

router.get("/events", (req,res)=>{
	res.render("index");	
});

router.get("/events/new", (req,res)=>{
	res.render("new");
});

router.post("/events" , (req,res)=>{	
	var startdate = new Date(req.body.event.startdate); //JS object from input HTMl
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	console.log(currentDate);
	res.send(currentDate);
});

module.exports = router;

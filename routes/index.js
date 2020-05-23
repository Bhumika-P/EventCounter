var express = require("express"),
	router = express.Router(),
	moment = require('moment-timezone'),
	Event = require("../models/event"),
	User = require("../models/user");

//Landing
router.get("/" , (req,res)=>{
	res.render("landing");
});

//INDEX route
router.get("/events", (req,res)=>{
	//send list of all events to index page
	Event.find({}, (err, allevents)=>{
		if(err){
			console.log(err);
		}else{
			res.render("index" , {events: allevents});	
		}
	});

});

//NEW route
router.get("/events/new", (req,res)=>{
	res.render("new");
});

//CREATE route
router.post("/events" , (req,res)=>{	
	//save new event in DB
	Event.create(req.body.event, (err,createdEvent)=>{
		if(err){
			console.log(err);
		}else{
			//console.log(req.body.event);
			console.log(createdEvent);
		}		 
	});
	res.redirect("/events");
});

//SHOW route
router.get("/events/:id", (req, res)=>{
	//shoe event by id
	Event.findById(req.params.id , (err, foundEvent)=>{
		if(err){
			console.log(err);
		}else{
			var startDate = new Date(foundEvent.startdate); //JS object from input HTMl
			//var now = new Date(); //This date is in Korean timezone
			//var currentDate = new Date(moment.tz('America/Los_Angeles').format('YYYY-MM-DD HH:mm:ss')); //This is in CDT
			var msPerDay = 1000* 24* 60* 60; //no of ms per day
			
			//console.log("Current Date" , currentDate ," - ",  currentDate.getTime());
			//console.log(moment.tz('America/Los_Angeles').format('YYYY-MM-DD HH:mm:ss'));
			
			var startDate_year = startDate.getFullYear();
			var startDate_month = startDate.getMonth();
			//console.log(currentDate.getMonth());
			//console.log(startDate_month);
			var startDate_day = startDate.getDate();
			

			var currentDate = new Date();
			currentDate.setDate(new Date().getDate()-1); //Need to fix this eventually. CurrentDate gives wrong date
			//console.log(currentDate.getDate());
			var dd = String(currentDate.getDate()).padStart(2, '0');
			var mm = String(currentDate.getMonth() + 1).padStart(2, '0'); //January is 0!
			var yyyy = currentDate.getFullYear();
			//console.log("Current Date" , currentDate ," - ",  currentDate.getTime());
	
			//=====================
			
			var currentDate_year = yyyy;
			var currentDate_month = mm-1;
			var currentDate_day = dd; 
			
			//console.log(currentDate_day);
			
			//================================================================
			if(currentDate_month == 11){
				var next_monthly_date = new Date(currentDate_year+1, 0 , startDate_day);
				//console.log(next_monthly_date);
				var m_days = Math.round ((next_monthly_date.getTime() - currentDate.getTime()) / msPerDay); //Days from the start date
				var ymd_monthly_array = YMDbreakdown(currentDate, next_monthly_date);
			}else {
				if(currentDate_day <= startDate_day){
				var next_monthly_date = new Date(currentDate_year, currentDate_month , startDate_day);
				//console.log("here" , next_monthly_date , currentDate);
				var m_days = Math.round ((next_monthly_date.getTime() - currentDate.getTime()) / msPerDay); //Days from the start date
				var ymd_monthly_array = YMDbreakdown(currentDate, next_monthly_date);
				}
				else if(currentDate_day > startDate_day){
				var next_monthly_date = new Date(currentDate_year, currentDate_month+1 , startDate_day);
				//console.log(next_monthly_date);
				var m_days = Math.round ((next_monthly_date.getTime() - currentDate.getTime()) / msPerDay); //Days from the start date
				var ymd_monthly_array = YMDbreakdown(currentDate, next_monthly_date);
				}
			}
			//const diffDays = Math.round(Math.abs((next_monthly_date - currentDate) / msPerDay));
			//console.log(next_monthly_date.getTime(), " ",currentDate.getTime(), " ",msPerDay," ", diffDays );
			//console.log("array" , ymd_monthly_array);
			//=====================================================================================
			if(startDate_month > currentDate_month || ((startDate_month == currentDate_month) && (startDate_day > currentDate_day)) ){
			    var next_yearly_date = new Date(currentDate_year, startDate_month , startDate_day);
		//		console.log("here",next_yearly_date, currentDate_year);
				var y_days = Math.round ((next_yearly_date.getTime() - currentDate.getTime()) / msPerDay); //Days from the start date
				var ymd_yearly_array = YMDbreakdown(currentDate, next_yearly_date);
			}else{
			   var next_yearly_date = new Date(currentDate_year+1, startDate_month , startDate_day);
		//		console.log("wtf",next_yearly_date);
				var y_days = Math.round ((next_yearly_date.getTime() - currentDate.getTime()) / msPerDay); //Days from the start date
				var ymd_yearly_array = YMDbreakdown(currentDate, next_yearly_date);
			}
			var days = Math.round ((currentDate.getTime() - startDate.getTime()) / msPerDay); //Days from the start date
			var ymd_array = YMDbreakdown(startDate, currentDate); //since event
			//console.log(m_days);
			res.render("show", {event:foundEvent ,ymd_array: ymd_array, monthly: ymd_monthly_array , yearly: ymd_yearly_array, days:days-1,mdays:m_days,ydays:y_days});
		}
	});
});

//UPDATE route

//DELETE route

function YMDbreakdown(date_1, date_2){ 

	var yAppendix, mAppendix, dAppendix;
	//console.log("inside fnc" , date_1 , date_2);
	//--------------------------------------------------------------
	var days = date_2.getDate() - date_1.getDate();
	//console.log("days - " + days);
	if (days < 0)
	{

		date_2.setMonth(date_2.getMonth()-1);
		days += DaysInMonth(date_2);
	//	console.log("days " + days);
	}
	//--------------------------------------------------------------
	var months = date_2.getMonth() - date_1.getMonth();
	//console.log("months - " + months);
	if (months < 0)
	{
		date_2.setFullYear(date_2.getFullYear() - 1);
		months += 12;
		//console.log("months " + months);
	}
	//--------------------------------------------------------------
	var years = date_2.getFullYear() - date_1.getFullYear();
	//console.log("years " + years);

	return [years, months, days];
}

function DaysInMonth(date2_UTC)
{
	var monthStart = new Date(date2_UTC.getFullYear(), date2_UTC.getMonth(), 1);
	var monthEnd = new Date(date2_UTC.getFullYear(), date2_UTC.getMonth() + 1, 1);
	var monthLength = (monthEnd - monthStart) / (1000 * 60 * 60 * 24);
	return monthLength;
}
module.exports = router;

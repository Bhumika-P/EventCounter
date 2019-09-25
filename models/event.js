var mongoose = require("mongoose");

//Event - StartDate, Name, Description
var eventSchema={
	name: String,
	startdate: String,
	description: String
};

module.exports = mongoose.model("Event", eventSchema);
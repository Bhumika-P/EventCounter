var express = require("express"),
	app = express(),
	mongoose = require("mongoose");

//User can have many events. 
// User -> Event: one to many relationship
// Event -> User: one to one relationship
"use strict";

var express = require('express');
var app = express();
var routes = require('./routes');
var logger = require('morgan');

//body parser can parse many types of data. In this case we only parse json 
var jsonParser = require("body-parser").json 
var port = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(jsonParser());

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/qa');

var db = mongoose.connection;

db.on('error', function(err){
	console.error("connection error:", err);
});

db.once("open", function(){
	console.log("db connection successful");
});

app.use(function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	if(req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE");
		return res.status(200).json({});
	}
	next();
})

app.use('/questions', routes);

// Catch 404 errors 
app.use(function(req, res, next){
	var err = new Error("Not found");
	err.status = 404;
	next(err);
});

//Error handler 
app.use(function(err, req, res, next){
	res.status(err.status || 500);
	var display = err.message;
	res.json({
		error: {
			message: display 
		}
	});
});


app.listen(port, function(){
	console.log("Server is listening on port:", port);
});
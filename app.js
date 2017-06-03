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
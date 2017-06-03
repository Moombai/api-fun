"use strict";

var express = require('express');
var router = express.Router();


// GET /questions 
// Return all questions 
router.get('/', function(req, res){
	res.json({
		response: "you sent me a get request"
	});
});

// POST /questions 
// Route for creating a question 
router.post('/', function(req, res){
	res.json({
		response: "you sent me a get request",
		body: req.body
	});
});

// GET /questions/:qID  
// Return a specific question by id 
router.get('/:qID', function(req, res){
	res.json({
		response: "you sent me a get request for the ID " + req.params.qID
	});
});


// POST /questions/:qID/answers  
// Route for creating an answer  
router.post('/:qID/answers', function(req, res){
	res.json({
		response: "you sent me a POST request to /answers",
		questionId: req.params.qID,
		body: req.body
	});
});


// PUT /questions/:id/answers/:ID  
// Edit a specific answer 
router.put("/:qID/answers/:aID", function(req, res){
	res.json({
		response: "You sent me a put request to /answers",
		questionId: req.params.qID,
		answerId: req.params.aID,
		body: req.body
	});
}); 


// Delete /questions/:id/answers/:ID  
// Delete a specific answer 
router.delete("/:qID/answers/:aID", function(req, res){
	res.json({
		response: "You sent me a delete request to /answers",
		questionId: req.params.qID,
		answerId: req.params.aID,
	});
}); 


// POST /questions/:qID/answers/:aID/vote-up
// POST /questions/:qID/answers/:aID/vote-down
// Vote on a specific answer 

// The first function argument is called before the first. Effectively acting as middleware 
router.post("/:qID/answers/:aID/vote-:dir", function(req, res, next){
	if(req.params.dir.search(/^(up|down)$/) === -1) {
		//create new error to pass to the error handler in app.js 
		var err = new Error("Not Found");
		err.status = 404;
		next(err);
	} else {
		//otherwise call the next rout handler 
		next();
	}
}, function(req, res){
	res.json({
		response: "You sent me a POST request to /vote" + req.params.dir,
		questionId: req.params.qID,
		answerId: req.params.aID,
		vote: req.params.dir
	});
}); 

module.exports = router;
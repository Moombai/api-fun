"use strict";

var express = require('express');
var router = express.Router();
var Question = require("./models").Question;

router.param("qID", function(req, res, next, id){
	Question.findById(id, function(err, doc){
		if(err) return next(err);
		if(!doc) {
			err = new Error("Not Found");
			err.status = 404;
			return next(err)
		}
		req.question = doc;
		return next();
	});
});

router.param("aID", function(req, res, next, id){
	req.answer = req.questions.answers.id(id);
	if(!req.answer){
		err = new Error("Not Found");
		err.status = 404;
		return next(err);
	}
	next();
});

// GET /questions 
// Return all questions 
router.get('/', function(req, res, next){
	Question.find({}, null, {sort: {createdAt: -1}}, function(err, questions){
		if (err) return next(err);
		res.json(questions);
	});
});

// POST /questions 
// Route for creating a question 
router.post('/', function(req, res, next){
	var question = new Question(req.body);
	question.save(function(err, question){
		if(err) return next(err);
		res.status(201);
		res.json(question);
	});
});

// GET /questions/:qID  
// Return a specific question by id 
router.get('/:qID', function(req, res, next){
	res.json(req.question);
});


// POST /questions/:qID/answers  
// Route for creating an answer  
router.post('/:qID/answers', function(req, res){
	req.question.answers.push(req.body);
	req.question.save(function(err, question){
		if(err) return next(err);
		res.status(201);
		res.json(question);
	});
});


// PUT /questions/:id/answers/:ID  
// Edit a specific answer 
router.put("/:qID/answers/:aID", function(req, res){
	req.answer.update(req.body, function(err, results){
		if(err) return next(err);
		res.json(result);
	});
}); 


// Delete /questions/:id/answers/:ID  
// Delete a specific answer 
router.delete("/:qID/answers/:aID", function(req, res){
	req.answer.remove(function(err){
		req.question.save(function(err, question){
			if(err) return next(err);
			res.json(question)
		});
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
			req.vote = req.params.dir; 
			next();
		}
	}, 
	function(req, res, next){
	req.answer.vote(req.vote, function(err, question){
		if(err) return next(err);
		res.json(question);
	});
}); 

module.exports = router;
'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SortAnswers = function(a, b){
	if(a.votes === b.votes){
		return b.updatedAt - a.updatedAt;
	}
	return b.votes - a.votes;
};
// AnswerSchema is created before Question Schema so it's defined when 
// the question Schema needs it 
var AnswerSchema = new Schema({
	text: String,
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now},
	votes: {type: Number, default: 0}
});

AnswerSchema.method("update", function(updates, callback){
	Object.assign(this, updates, {updatedAt: new Date()});
	this.parent().save(callback);
});

AnswerSchema.method("update", function(votes, callback){
	if(vote === "up"){
		this.votes += 1;
	} else {
		this.votes -= 1;
	}
	this.parent().save(callback);
});

var QuestionSchema = new Schema({
	text: String,
	createdAt: {type: Date, default: Date.now},
	// The AnswerSchema is placed as the sole property of the answers array
	// This lets Mongo know there will be a relationship between the 
	// Questions and answers Schema 
	answers: [AnswerSchema]
});

Question.Schema.pre("save", function(next){
	this.answers.sort(SortAnswers);
	next();
});

var Question = mongoose.model("Question", QuestionSchema);

module.exports.Question = Question;










'use strict';

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sandbox');

var db = mongoose.connection;

db.on('error', function(err){
	console.error("connection error:", err);
});

db.once("open", function(){
	console.log("db connection successful");
	// All database communication goes here 

	var Schema = mongoose.Schema;
	var AnimalSchema = new Schema({
		type:  {type: String, default: "Goldfish"},
		size:  {type: String, default: "small"},
		color: {type: String, default: "gold"},
		mass:  {type: Number, default: 0.007},
		name:  {type: String, default: "Goldeen"}
	});

	var Animal = mongoose.model('Animal', AnimalSchema);

	var elephant = new Animal({
		type: 'elephant',
		size: 'big',
		color: 'grey',
		mass: 6000,
		name: 'Lawrence'
	});

	var animal = new Animal({});

	var whale = new Animal({
		type: 'whale',
		size: 'big',
		mass: 190500,
		name: 'Fenchurch'
	})

	// Clears the mongodb collection 
	Animal.remove({}, function(err){
		if (err) console.error(err);
		elephant.save(function(err){
			if(err) console.error("Save failed", err);
			animal.save(function(err){
				if(err) console.error("Save failed", err);
				whale.save(function(err){
					if(err) console.error("Save failed", err);
					Animal.find({size: 'big'}, function(err, animals){
						animals.forEach(function(animal){
							console.log(animal.name + " the " + animal.color + " " + animal.type)
						});
						db.close(function(){
							console.log("db connection closed");
						});
					});
				});
			});
		});
	});
});
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Film Schema
 */
var FilmSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Film name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Film', FilmSchema);
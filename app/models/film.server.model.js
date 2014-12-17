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
	camera: {
		type: String,
		default: '',
		trim: true
	},
	catalog: {
		type: String,
		default: '',
		trim: true
	},
	film: {
		type: String,
		default: '',
		trim: true
	},
	type: {
		type: String,
		default: '',
		trim: true
	},
	iso: {
		type: Number,
		default: '',
		trim: true
	},
	format: {
		type: String,
		default: '',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	start: {
		type: Date,
		default: '',
		trim: true
	},
	finish: {
		type: Date,
		default: '',
		trim: true
	},
	develop: {
		type: Date,
		default: '',
		trim: true
	},
	scan: {
		type: Date,
		default: '',
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

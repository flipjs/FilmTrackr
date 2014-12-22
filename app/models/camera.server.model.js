'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Camera Schema
 */
var CameraSchema = new Schema({
	cameraModel: {
		type: String,
		default: '',
		required: true,
		trim: true
	},
	active: {
		type: Boolean,
		default: true,
		required: true
	},
	fixedLens: {
		type: Boolean,
		default: true,
		required: true
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

mongoose.model('Camera', CameraSchema);

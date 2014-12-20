'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Camera = mongoose.model('Camera'),
	_ = require('lodash');

/**
 * Create a Camera
 */
exports.create = function(req, res) {
	var camera = new Camera(req.body);
	camera.user = req.user;

	camera.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(camera);
		}
	});
};

/**
 * Show the current Camera
 */
exports.read = function(req, res) {
	res.jsonp(req.camera);
};

/**
 * Update a Camera
 */
exports.update = function(req, res) {
	var camera = req.camera ;

	camera = _.extend(camera , req.body);

	camera.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(camera);
		}
	});
};

/**
 * Delete an Camera
 */
exports.delete = function(req, res) {
	var camera = req.camera ;

	camera.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(camera);
		}
	});
};

/**
 * List of Cameras
 */
exports.list = function(req, res) { 
	Camera.find().sort('-created').populate('user', 'displayName').exec(function(err, cameras) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cameras);
		}
	});
};

/**
 * Camera middleware
 */
exports.cameraByID = function(req, res, next, id) { 
	Camera.findById(id).populate('user', 'displayName').exec(function(err, camera) {
		if (err) return next(err);
		if (! camera) return next(new Error('Failed to load Camera ' + id));
		req.camera = camera ;
		next();
	});
};

/**
 * Camera authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.camera.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

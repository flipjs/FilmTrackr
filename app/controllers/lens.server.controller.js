'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Len = mongoose.model('Len'),
	_ = require('lodash');

/**
 * Create a Len
 */
exports.create = function(req, res) {
	var len = new Len(req.body);
	len.user = req.user;

	len.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(len);
		}
	});
};

/**
 * Show the current Len
 */
exports.read = function(req, res) {
	res.jsonp(req.len);
};

/**
 * Update a Len
 */
exports.update = function(req, res) {
	var len = req.len ;

	len = _.extend(len , req.body);

	len.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(len);
		}
	});
};

/**
 * Delete an Len
 */
exports.delete = function(req, res) {
	var len = req.len ;

	len.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(len);
		}
	});
};

/**
 * List of Lens
 */
exports.list = function(req, res) { 
	Len.find().sort('-created').populate('user', 'displayName').exec(function(err, lens) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(lens);
		}
	});
};

/**
 * Len middleware
 */
exports.lenByID = function(req, res, next, id) { 
	Len.findById(id).populate('user', 'displayName').exec(function(err, len) {
		if (err) return next(err);
		if (! len) return next(new Error('Failed to load Len ' + id));
		req.len = len ;
		next();
	});
};

/**
 * Len authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.len.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

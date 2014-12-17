'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Film = mongoose.model('Film'),
	_ = require('lodash');

/**
 * Create a Film
 */
exports.create = function(req, res) {
	var film = new Film(req.body);
	film.user = req.user;

	film.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(film);
		}
	});
};

/**
 * Show the current Film
 */
exports.read = function(req, res) {
	res.jsonp(req.film);
};

/**
 * Update a Film
 */
exports.update = function(req, res) {
	var film = req.film ;

	film = _.extend(film , req.body);

	film.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(film);
		}
	});
};

/**
 * Delete an Film
 */
exports.delete = function(req, res) {
	var film = req.film ;

	film.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(film);
		}
	});
};

/**
 * List of Films
 */
exports.list = function(req, res) { 
	Film.find().sort('-created').populate('user', 'displayName').exec(function(err, films) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(films);
		}
	});
};

/**
 * Film middleware
 */
exports.filmByID = function(req, res, next, id) { 
	Film.findById(id).populate('user', 'displayName').exec(function(err, film) {
		if (err) return next(err);
		if (! film) return next(new Error('Failed to load Film ' + id));
		req.film = film ;
		next();
	});
};

/**
 * Film authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.film.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

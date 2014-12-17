'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Film = mongoose.model('Film'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, film;

/**
 * Film routes tests
 */
describe('Film CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Film
		user.save(function() {
			film = {
				name: 'Film Name'
			};

			done();
		});
	});

	it('should be able to save Film instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Film
				agent.post('/films')
					.send(film)
					.expect(200)
					.end(function(filmSaveErr, filmSaveRes) {
						// Handle Film save error
						if (filmSaveErr) done(filmSaveErr);

						// Get a list of Films
						agent.get('/films')
							.end(function(filmsGetErr, filmsGetRes) {
								// Handle Film save error
								if (filmsGetErr) done(filmsGetErr);

								// Get Films list
								var films = filmsGetRes.body;

								// Set assertions
								(films[0].user._id).should.equal(userId);
								(films[0].name).should.match('Film Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Film instance if not logged in', function(done) {
		agent.post('/films')
			.send(film)
			.expect(401)
			.end(function(filmSaveErr, filmSaveRes) {
				// Call the assertion callback
				done(filmSaveErr);
			});
	});

	it('should not be able to save Film instance if no name is provided', function(done) {
		// Invalidate name field
		film.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Film
				agent.post('/films')
					.send(film)
					.expect(400)
					.end(function(filmSaveErr, filmSaveRes) {
						// Set message assertion
						(filmSaveRes.body.message).should.match('Please fill Film name');
						
						// Handle Film save error
						done(filmSaveErr);
					});
			});
	});

	it('should be able to update Film instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Film
				agent.post('/films')
					.send(film)
					.expect(200)
					.end(function(filmSaveErr, filmSaveRes) {
						// Handle Film save error
						if (filmSaveErr) done(filmSaveErr);

						// Update Film name
						film.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Film
						agent.put('/films/' + filmSaveRes.body._id)
							.send(film)
							.expect(200)
							.end(function(filmUpdateErr, filmUpdateRes) {
								// Handle Film update error
								if (filmUpdateErr) done(filmUpdateErr);

								// Set assertions
								(filmUpdateRes.body._id).should.equal(filmSaveRes.body._id);
								(filmUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Films if not signed in', function(done) {
		// Create new Film model instance
		var filmObj = new Film(film);

		// Save the Film
		filmObj.save(function() {
			// Request Films
			request(app).get('/films')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Film if not signed in', function(done) {
		// Create new Film model instance
		var filmObj = new Film(film);

		// Save the Film
		filmObj.save(function() {
			request(app).get('/films/' + filmObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', film.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Film instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Film
				agent.post('/films')
					.send(film)
					.expect(200)
					.end(function(filmSaveErr, filmSaveRes) {
						// Handle Film save error
						if (filmSaveErr) done(filmSaveErr);

						// Delete existing Film
						agent.delete('/films/' + filmSaveRes.body._id)
							.send(film)
							.expect(200)
							.end(function(filmDeleteErr, filmDeleteRes) {
								// Handle Film error error
								if (filmDeleteErr) done(filmDeleteErr);

								// Set assertions
								(filmDeleteRes.body._id).should.equal(filmSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Film instance if not signed in', function(done) {
		// Set Film user 
		film.user = user;

		// Create new Film model instance
		var filmObj = new Film(film);

		// Save the Film
		filmObj.save(function() {
			// Try deleting Film
			request(app).delete('/films/' + filmObj._id)
			.expect(401)
			.end(function(filmDeleteErr, filmDeleteRes) {
				// Set message assertion
				(filmDeleteRes.body.message).should.match('User is not logged in');

				// Handle Film error error
				done(filmDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Film.remove().exec();
		done();
	});
});
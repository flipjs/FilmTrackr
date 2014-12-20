'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Len = mongoose.model('Len'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, len;

/**
 * Len routes tests
 */
describe('Len CRUD tests', function() {
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

		// Save a user to the test db and create new Len
		user.save(function() {
			len = {
				name: 'Len Name'
			};

			done();
		});
	});

	it('should be able to save Len instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Len
				agent.post('/lens')
					.send(len)
					.expect(200)
					.end(function(lenSaveErr, lenSaveRes) {
						// Handle Len save error
						if (lenSaveErr) done(lenSaveErr);

						// Get a list of Lens
						agent.get('/lens')
							.end(function(lensGetErr, lensGetRes) {
								// Handle Len save error
								if (lensGetErr) done(lensGetErr);

								// Get Lens list
								var lens = lensGetRes.body;

								// Set assertions
								(lens[0].user._id).should.equal(userId);
								(lens[0].name).should.match('Len Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Len instance if not logged in', function(done) {
		agent.post('/lens')
			.send(len)
			.expect(401)
			.end(function(lenSaveErr, lenSaveRes) {
				// Call the assertion callback
				done(lenSaveErr);
			});
	});

	it('should not be able to save Len instance if no name is provided', function(done) {
		// Invalidate name field
		len.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Len
				agent.post('/lens')
					.send(len)
					.expect(400)
					.end(function(lenSaveErr, lenSaveRes) {
						// Set message assertion
						(lenSaveRes.body.message).should.match('Please fill Len name');
						
						// Handle Len save error
						done(lenSaveErr);
					});
			});
	});

	it('should be able to update Len instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Len
				agent.post('/lens')
					.send(len)
					.expect(200)
					.end(function(lenSaveErr, lenSaveRes) {
						// Handle Len save error
						if (lenSaveErr) done(lenSaveErr);

						// Update Len name
						len.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Len
						agent.put('/lens/' + lenSaveRes.body._id)
							.send(len)
							.expect(200)
							.end(function(lenUpdateErr, lenUpdateRes) {
								// Handle Len update error
								if (lenUpdateErr) done(lenUpdateErr);

								// Set assertions
								(lenUpdateRes.body._id).should.equal(lenSaveRes.body._id);
								(lenUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Lens if not signed in', function(done) {
		// Create new Len model instance
		var lenObj = new Len(len);

		// Save the Len
		lenObj.save(function() {
			// Request Lens
			request(app).get('/lens')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Len if not signed in', function(done) {
		// Create new Len model instance
		var lenObj = new Len(len);

		// Save the Len
		lenObj.save(function() {
			request(app).get('/lens/' + lenObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', len.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Len instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Len
				agent.post('/lens')
					.send(len)
					.expect(200)
					.end(function(lenSaveErr, lenSaveRes) {
						// Handle Len save error
						if (lenSaveErr) done(lenSaveErr);

						// Delete existing Len
						agent.delete('/lens/' + lenSaveRes.body._id)
							.send(len)
							.expect(200)
							.end(function(lenDeleteErr, lenDeleteRes) {
								// Handle Len error error
								if (lenDeleteErr) done(lenDeleteErr);

								// Set assertions
								(lenDeleteRes.body._id).should.equal(lenSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Len instance if not signed in', function(done) {
		// Set Len user 
		len.user = user;

		// Create new Len model instance
		var lenObj = new Len(len);

		// Save the Len
		lenObj.save(function() {
			// Try deleting Len
			request(app).delete('/lens/' + lenObj._id)
			.expect(401)
			.end(function(lenDeleteErr, lenDeleteRes) {
				// Set message assertion
				(lenDeleteRes.body.message).should.match('User is not logged in');

				// Handle Len error error
				done(lenDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Len.remove().exec();
		done();
	});
});
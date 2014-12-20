'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Camera = mongoose.model('Camera'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, camera;

/**
 * Camera routes tests
 */
describe('Camera CRUD tests', function() {
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

		// Save a user to the test db and create new Camera
		user.save(function() {
			camera = {
				name: 'Camera Name'
			};

			done();
		});
	});

	it('should be able to save Camera instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Camera
				agent.post('/cameras')
					.send(camera)
					.expect(200)
					.end(function(cameraSaveErr, cameraSaveRes) {
						// Handle Camera save error
						if (cameraSaveErr) done(cameraSaveErr);

						// Get a list of Cameras
						agent.get('/cameras')
							.end(function(camerasGetErr, camerasGetRes) {
								// Handle Camera save error
								if (camerasGetErr) done(camerasGetErr);

								// Get Cameras list
								var cameras = camerasGetRes.body;

								// Set assertions
								(cameras[0].user._id).should.equal(userId);
								(cameras[0].name).should.match('Camera Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Camera instance if not logged in', function(done) {
		agent.post('/cameras')
			.send(camera)
			.expect(401)
			.end(function(cameraSaveErr, cameraSaveRes) {
				// Call the assertion callback
				done(cameraSaveErr);
			});
	});

	it('should not be able to save Camera instance if no name is provided', function(done) {
		// Invalidate name field
		camera.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Camera
				agent.post('/cameras')
					.send(camera)
					.expect(400)
					.end(function(cameraSaveErr, cameraSaveRes) {
						// Set message assertion
						(cameraSaveRes.body.message).should.match('Please fill Camera name');
						
						// Handle Camera save error
						done(cameraSaveErr);
					});
			});
	});

	it('should be able to update Camera instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Camera
				agent.post('/cameras')
					.send(camera)
					.expect(200)
					.end(function(cameraSaveErr, cameraSaveRes) {
						// Handle Camera save error
						if (cameraSaveErr) done(cameraSaveErr);

						// Update Camera name
						camera.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Camera
						agent.put('/cameras/' + cameraSaveRes.body._id)
							.send(camera)
							.expect(200)
							.end(function(cameraUpdateErr, cameraUpdateRes) {
								// Handle Camera update error
								if (cameraUpdateErr) done(cameraUpdateErr);

								// Set assertions
								(cameraUpdateRes.body._id).should.equal(cameraSaveRes.body._id);
								(cameraUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Cameras if not signed in', function(done) {
		// Create new Camera model instance
		var cameraObj = new Camera(camera);

		// Save the Camera
		cameraObj.save(function() {
			// Request Cameras
			request(app).get('/cameras')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Camera if not signed in', function(done) {
		// Create new Camera model instance
		var cameraObj = new Camera(camera);

		// Save the Camera
		cameraObj.save(function() {
			request(app).get('/cameras/' + cameraObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', camera.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Camera instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Camera
				agent.post('/cameras')
					.send(camera)
					.expect(200)
					.end(function(cameraSaveErr, cameraSaveRes) {
						// Handle Camera save error
						if (cameraSaveErr) done(cameraSaveErr);

						// Delete existing Camera
						agent.delete('/cameras/' + cameraSaveRes.body._id)
							.send(camera)
							.expect(200)
							.end(function(cameraDeleteErr, cameraDeleteRes) {
								// Handle Camera error error
								if (cameraDeleteErr) done(cameraDeleteErr);

								// Set assertions
								(cameraDeleteRes.body._id).should.equal(cameraSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Camera instance if not signed in', function(done) {
		// Set Camera user 
		camera.user = user;

		// Create new Camera model instance
		var cameraObj = new Camera(camera);

		// Save the Camera
		cameraObj.save(function() {
			// Try deleting Camera
			request(app).delete('/cameras/' + cameraObj._id)
			.expect(401)
			.end(function(cameraDeleteErr, cameraDeleteRes) {
				// Set message assertion
				(cameraDeleteRes.body.message).should.match('User is not logged in');

				// Handle Camera error error
				done(cameraDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Camera.remove().exec();
		done();
	});
});
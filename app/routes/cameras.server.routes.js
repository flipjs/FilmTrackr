'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var cameras = require('../../app/controllers/cameras.server.controller');

	// Cameras Routes
	app.route('/cameras')
		.get(cameras.list)
		.post(users.requiresLogin, cameras.create);

	app.route('/cameras/:cameraId')
		.get(cameras.read)
		.put(users.requiresLogin, cameras.hasAuthorization, cameras.update)
		.delete(users.requiresLogin, cameras.hasAuthorization, cameras.delete);

	// Finish by binding the Camera middleware
	app.param('cameraId', cameras.cameraByID);
};

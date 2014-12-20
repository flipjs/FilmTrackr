'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var lens = require('../../app/controllers/lens.server.controller');

	// Lens Routes
	app.route('/lens')
		.get(lens.list)
		.post(users.requiresLogin, lens.create);

	app.route('/lens/:lenId')
		.get(lens.read)
		.put(users.requiresLogin, lens.hasAuthorization, lens.update)
		.delete(users.requiresLogin, lens.hasAuthorization, lens.delete);

	// Finish by binding the Len middleware
	app.param('lenId', lens.lenByID);
};

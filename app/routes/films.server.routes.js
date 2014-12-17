'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var films = require('../../app/controllers/films.server.controller');

	// Films Routes
	app.route('/films')
		.get(films.list)
		.post(users.requiresLogin, films.create);

	app.route('/films/:filmId')
		.get(films.read)
		.put(users.requiresLogin, films.hasAuthorization, films.update)
		.delete(users.requiresLogin, films.hasAuthorization, films.delete);

	// Finish by binding the Film middleware
	app.param('filmId', films.filmByID);
};

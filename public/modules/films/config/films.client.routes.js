'use strict';

//Setting up route
angular.module('films').config(['$stateProvider',
	function($stateProvider) {
		// Films state routing
		$stateProvider.
		state('listFilms', {
			url: '/films',
			templateUrl: 'modules/films/views/list-films.client.view.html'
		}).
		state('createFilm', {
			url: '/films/create',
			templateUrl: 'modules/films/views/create-film.client.view.html'
		}).
		state('viewFilm', {
			url: '/films/:filmId',
			templateUrl: 'modules/films/views/view-film.client.view.html'
		}).
		state('editFilm', {
			url: '/films/:filmId/edit',
			templateUrl: 'modules/films/views/edit-film.client.view.html'
		});
	}
]);
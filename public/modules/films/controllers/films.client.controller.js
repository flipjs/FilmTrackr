void (function() {
  
	'use strict';

	angular.module('films')
		.controller('FilmsController', FilmsController)

	FilmsController.$inject = ['$scope', '$stateParams', '$location', 'Authentication', 'Films']

	function FilmsController($scope, $stateParams, $location, Authentication, Films) {

		var self = this

		$scope.authentication = Authentication

		self.filmRoll = {}

		// Create new Film
		self.create = function() {
			// Create new Film object
			var film = new Films ({
				camera      : self.filmRoll.camera,
				catalog     : self.filmRoll.catalog,
				film        : self.filmRoll.film,
				type        : self.filmRoll.type,
				iso         : self.filmRoll.iso,
				format      : self.filmRoll.format,
				description : self.filmRoll.description,
				start       : self.filmRoll.start,
				finish      : self.filmRoll.finish,
				develop     : self.filmRoll.develop,
				scan        : self.filmRoll.scan
			})

			// Redirect after save
			film.$save(function(response) {
				$location.path('films/' + response._id)

				// Clear form fields
				self.filmRoll.camera = ''
				self.filmRoll.catalog = ''
				self.filmRoll.film = ''
				self.filmRoll.type = ''
				self.filmRoll.iso = ''
				self.filmRoll.format = ''
				self.filmRoll.description = ''
				self.filmRoll.start = ''
				self.filmRoll.finish = ''
				self.filmRoll.develop = ''
				self.filmRoll.scan = ''

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message
			})
		}

		// Remove existing Film
		self.remove = function(film) {
			if ( film ) { 
				film.$remove()

				for (var i in self.films) {
					if (self.films [i] === film) {
						self.films.splice(i, 1)
					}
				}
			} else {
				self.film.$remove(function() {
					$location.path('films')
				})
			}
		}

		// Update existing Film
		self.update = function() {
			var film = self.film

			film.$update(function() {
				$location.path('films/' + film._id)
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message
			})
		}

		// Find a list of Films
		self.find = function() {
			self.films = Films.query()
		}

		// Find existing Film
		self.findOne = function() {
			self.film = Films.get({ 
				filmId: $stateParams.filmId
			})
		}

		$scope.FilmsCtrl= self
	}

})()

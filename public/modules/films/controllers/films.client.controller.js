'use strict';

// Films controller
angular.module('films').controller('FilmsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Films',
	function($scope, $stateParams, $location, Authentication, Films) {
		$scope.authentication = Authentication;

		// Create new Film
		$scope.create = function() {
			// Create new Film object
			var film = new Films ({
				name: this.name
			});

			// Redirect after save
			film.$save(function(response) {
				$location.path('films/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Film
		$scope.remove = function(film) {
			if ( film ) { 
				film.$remove();

				for (var i in $scope.films) {
					if ($scope.films [i] === film) {
						$scope.films.splice(i, 1);
					}
				}
			} else {
				$scope.film.$remove(function() {
					$location.path('films');
				});
			}
		};

		// Update existing Film
		$scope.update = function() {
			var film = $scope.film;

			film.$update(function() {
				$location.path('films/' + film._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Films
		$scope.find = function() {
			$scope.films = Films.query();
		};

		// Find existing Film
		$scope.findOne = function() {
			$scope.film = Films.get({ 
				filmId: $stateParams.filmId
			});
		};
	}
]);
'use strict';

// Lens controller
angular.module('lens').controller('LensController', ['$scope', '$stateParams', '$location', 'Authentication', 'Lens',
	function($scope, $stateParams, $location, Authentication, Lens) {
		$scope.authentication = Authentication;

		// Create new Len
		$scope.create = function() {
			// Create new Len object
			var len = new Lens ({
				name: this.name
			});

			// Redirect after save
			len.$save(function(response) {
				$location.path('lens/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Len
		$scope.remove = function(len) {
			if ( len ) { 
				len.$remove();

				for (var i in $scope.lens) {
					if ($scope.lens [i] === len) {
						$scope.lens.splice(i, 1);
					}
				}
			} else {
				$scope.len.$remove(function() {
					$location.path('lens');
				});
			}
		};

		// Update existing Len
		$scope.update = function() {
			var len = $scope.len;

			len.$update(function() {
				$location.path('lens/' + len._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Lens
		$scope.find = function() {
			$scope.lens = Lens.query();
		};

		// Find existing Len
		$scope.findOne = function() {
			$scope.len = Lens.get({ 
				lenId: $stateParams.lenId
			});
		};
	}
]);
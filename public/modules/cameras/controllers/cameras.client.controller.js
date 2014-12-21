'use strict';

// Cameras controller
angular.module('cameras').controller('CamerasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Cameras',
	function($scope, $stateParams, $location, Authentication, Cameras) {
		$scope.authentication = Authentication;

		var self = this

		self.camera = {}

		// Create new Camera
		self.create = function(newCamera) {
			// Create new Camera object
			var camera = new Cameras ({
				name: newCamera.name
			});

			// Redirect after save
			camera.$save(function(response) {
				$location.path('cameras/' + response._id);

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Camera
		self.remove = function(camera) {
			if ( camera ) { 
				camera.$remove();

				for (var i in self.cameras) {
					if (self.cameras [i] === camera) {
						self.cameras.splice(i, 1);
					}
				}
			} else {
				self.camera.$remove(function() {
					$location.path('cameras');
				});
			}
		};

		// Update existing Camera
		self.update = function() {
			var camera = self.camera;

			camera.$update(function() {
				$location.path('cameras/' + camera._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Cameras
		self.find = function() {
			self.cameras = Cameras.query();
		};

		// Find existing Camera
		self.findOne = function() {
			self.camera = Cameras.get({ 
				cameraId: $stateParams.cameraId
			});
		};
	}
]);

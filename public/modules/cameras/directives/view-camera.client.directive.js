void (function() {

	'use strict';

	angular.module('cameras')
		.directive('viewCamera', viewCamera)
		.controller('ViewCameraController', ViewCameraController)
	
	function viewCamera() {
		return {
			restrict: 'E',
			scope: {
				camera: '=',
				remove: '&'
			},
			replace: true,
			templateUrl: 'modules/cameras/views/view-camera.client.view.html',
			controller: 'ViewCameraController',
			controllerAs: 'viewCtrl'
		}
	}

	ViewCameraController.$inject = ['$scope', 'Authentication']
	function ViewCameraController($scope, Authentication) {
		var self = this
		self.authentication = Authentication
		self.camera = $scope.camera

		self.remove = function remove() {
			$scope.remove({camera: self.camera})
		}
	}

})()


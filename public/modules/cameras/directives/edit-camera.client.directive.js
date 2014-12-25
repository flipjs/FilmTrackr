void (function() {

	'use strict';

	angular.module('cameras')
		.directive('editCamera', editCamera)
		.controller('EditCameraController', EditCameraController)
	
	function editCamera() {
		return {
			restrict: 'E',
			scope: {
				camera: '=',
				edit: '&'
			},
			replace: true,
			templateUrl: 'modules/cameras/views/edit-camera.client.view.html',
			controller: 'EditCameraController',
			controllerAs: 'editCtrl'
		}
	}

	EditCameraController.$inject = ['$scope', 'Authentication']
	function EditCameraController($scope, Authentication) {
		var self = this
		self.authentication = Authentication
		self.camera = $scope.camera

		self.edit = function edit() {
			$scope.edit({camera: self.camera})
		}
	}

})()



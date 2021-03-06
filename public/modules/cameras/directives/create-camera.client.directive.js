void (function() {

	'use strict';

	angular.module('cameras')
		.directive('createCamera', createCamera)
		.controller('CreateCameraController', CreateCameraController)
	
	function createCamera() {
		return {
			restrict: 'E',
			scope: {
				create: '&'
			},
			replace: true,
			templateUrl: 'modules/cameras/views/create-camera.client.view.html',
			controller: 'CreateCameraController',
			controllerAs: 'createCtrl'
		}
	}

	CreateCameraController.$inject = ['$scope']
	function CreateCameraController($scope) {
		var self = this

		self.camera = {}

		function resetCamera() {
			self.camera = {
				cameraModel: '',
				active: true,
				fixedLens: false
			}
		}

		resetCamera()

		self.create = function create() {
			$scope.create({newCamera: self.camera})
			resetCamera()
		}
	}

})()

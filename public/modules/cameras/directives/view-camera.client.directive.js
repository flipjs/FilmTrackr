void (function() {

	'use strict';

	angular.module('cameras')
		.directive('viewCamera', viewCamera)
		.controller('ViewCameraController', ViewCameraController)
	
	function viewCamera() {
		return {
			restrict: 'E',
			scope: {
				camera: '='
			},
			replace: true,
			templateUrl: 'modules/cameras/views/view-camera.client.view.html',
			controller: 'ViewCameraController',
			controllerAs: 'viewCtrl'
		}
	}

	ViewCameraController.$inject = ['$scope']
	function ViewCameraController($scope) {
		var self = this
		self.camera = $scope.camera
	}

})()


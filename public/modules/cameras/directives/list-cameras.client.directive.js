void (function() {

	'use strict';

	angular.module('cameras')
		.directive('listCameras', listCameras)
		.controller('ListCamerasController', ListCamerasController)
	
	function listCameras() {
		return {
			restrict: 'E',
			scope: {
				cameras: '='
			},
			replace: true,
			templateUrl: 'modules/cameras/views/list-cameras.client.view.html',
			controller: 'ListCamerasController',
			controllerAs: 'listCtrl'
		}
	}

	ListCamerasController.$inject = ['$scope']
	function ListCamerasController($scope) {
		var self = this
		self.cameras = $scope.cameras
	}

})()


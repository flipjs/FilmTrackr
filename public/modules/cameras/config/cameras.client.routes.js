'use strict';

//Setting up route
angular.module('cameras').config(['$stateProvider',
	function($stateProvider) {
		// Cameras state routing
		$stateProvider.
		state('listCameras', {
			url: '/cameras',
			templateUrl: 'modules/cameras/views/list-cameras.client.view.html'
		}).
		state('createCamera', {
			url: '/cameras/create',
			templateUrl: 'modules/cameras/views/create-camera.client.view.html'
		}).
		state('viewCamera', {
			url: '/cameras/:cameraId',
			templateUrl: 'modules/cameras/views/view-camera.client.view.html'
		}).
		state('editCamera', {
			url: '/cameras/:cameraId/edit',
			templateUrl: 'modules/cameras/views/edit-camera.client.view.html'
		});
	}
]);
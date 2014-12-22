'use strict';

//Setting up route
angular.module('cameras').config(['$stateProvider',
	function($stateProvider) {
		// Cameras state routing
		$stateProvider.
		state('listCameras', {
			url: '/cameras',
			template: '<section data-ng-init="ctrl.find()"><list-cameras cameras="ctrl.cameras"></list-cameras></section>',
			controller: 'CamerasController',
			controllerAs: 'ctrl'
		}).
		state('createCamera', {
			url: '/cameras/create',
			template: '<section><create-camera create="ctrl.create(newCamera)"></create-camera></section>',
			controller: 'CamerasController',
			controllerAs: 'ctrl'
		}).
		state('viewCamera', {
			url: '/cameras/:cameraId',
			template: '<section data-ng-init="ctrl.findOne()"><view-camera camera="ctrl.camera"></view-camera></section>',
			controller: 'CamerasController',
			controllerAs: 'ctrl'
		}).
		state('editCamera', {
			url: '/cameras/:cameraId/edit',
			template: '<section><edit-camera></edit-camera></section>',
			controller: 'CamerasController',
			controllerAs: 'ctrl'
		});
	}
]);

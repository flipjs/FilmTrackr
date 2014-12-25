void (function() {

	'use strict';

	//Setting up route
	angular.module('cameras').config(routeConfig)

	routeConfig.$inject = ['$stateProvider']
	function routeConfig($stateProvider) {
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
			template: '<section data-ng-init="ctrl.findOne()"><view-camera camera="ctrl.camera" remove="ctrl.remove(camera)"></view-camera></section>',
			controller: 'CamerasController',
			controllerAs: 'ctrl'
		}).
		state('editCamera', {
			url: '/cameras/:cameraId/edit',
			template: '<section data-ng-init="ctrl.findOne()"><edit-camera camera="ctrl.camera" edit="ctrl.update(camera)"></edit-camera></section>',
			controller: 'CamerasController',
			controllerAs: 'ctrl'
		})
	}

})()

'use strict';

//Setting up route
angular.module('lens').config(['$stateProvider',
	function($stateProvider) {
		// Lens state routing
		$stateProvider.
		state('listLens', {
			url: '/lens',
			templateUrl: 'modules/lens/views/list-lens.client.view.html'
		}).
		state('createLen', {
			url: '/lens/create',
			templateUrl: 'modules/lens/views/create-len.client.view.html'
		}).
		state('viewLen', {
			url: '/lens/:lenId',
			templateUrl: 'modules/lens/views/view-len.client.view.html'
		}).
		state('editLen', {
			url: '/lens/:lenId/edit',
			templateUrl: 'modules/lens/views/edit-len.client.view.html'
		});
	}
]);
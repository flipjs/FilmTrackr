void (function() {

	'use strict';

	//Cameras service used to communicate Cameras REST endpoints
	angular.module('cameras')
		.factory('Cameras', Cameras)

	Cameras.$inject = ['$resource']
	function Cameras($resource) {
		return $resource('cameras/:cameraId', { cameraId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		})
	}

})()

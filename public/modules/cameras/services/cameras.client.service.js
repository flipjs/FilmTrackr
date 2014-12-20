'use strict';

//Cameras service used to communicate Cameras REST endpoints
angular.module('cameras').factory('Cameras', ['$resource',
	function($resource) {
		return $resource('cameras/:cameraId', { cameraId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
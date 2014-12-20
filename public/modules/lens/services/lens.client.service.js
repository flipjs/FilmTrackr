'use strict';

//Lens service used to communicate Lens REST endpoints
angular.module('lens').factory('Lens', ['$resource',
	function($resource) {
		return $resource('lens/:lenId', { lenId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
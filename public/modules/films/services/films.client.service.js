'use strict';

//Films service used to communicate Films REST endpoints
angular.module('films').factory('Films', ['$resource',
	function($resource) {
		return $resource('films/:filmId', { filmId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
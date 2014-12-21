void (function() {

	'use strict';

	var fieldTypes = {
		camera      : 'text',
		catalog     : 'text',
		film        : 'text',
		type        : 'text',
		iso         : 'number',
		format      : 'text',
		description : 'text',
		start       : 'date',
		finish      : 'date',
		develop     : 'date',
		scan        : 'date'
	}

	//Films service used to communicate Films REST endpoints
	angular.module('films')
		.factory('Films', Films)
		.value('fieldTypes', fieldTypes)
	
	Films.$inject = ['$resource']
	function Films($resource) {
		return $resource('films/:filmId', { filmId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		})
	}

})()

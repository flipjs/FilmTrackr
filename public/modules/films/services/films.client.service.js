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
			},
			get: {
				method: 'GET',
				transformResponse: function(data) {
					var film = angular.fromJson(data)
					void ['start', 'finish', 'develop', 'scan'].map(function(item) {
						film[item] = film[item] && film[item].slice(0, 10)
					})
					return film
				}
			}
		})
	}

})()

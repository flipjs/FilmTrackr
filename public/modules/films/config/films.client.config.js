'use strict';

// Configuring the Articles module
angular.module('films').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Films', 'films', 'dropdown', '/films(/create)?');
		Menus.addSubMenuItem('topbar', 'films', 'List Films', 'films');
		Menus.addSubMenuItem('topbar', 'films', 'New Film', 'films/create');
	}
]);
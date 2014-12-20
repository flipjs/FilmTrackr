'use strict';

// Configuring the Articles module
angular.module('cameras').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Cameras', 'cameras', 'dropdown', '/cameras(/create)?');
		Menus.addSubMenuItem('topbar', 'cameras', 'List Cameras', 'cameras');
		Menus.addSubMenuItem('topbar', 'cameras', 'New Camera', 'cameras/create');
	}
]);
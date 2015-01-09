'use strict';

// Configuring the Articles module
angular.module('lens').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Lenses', 'lens', 'dropdown', '/lens(/create)?');
		Menus.addSubMenuItem('topbar', 'lens', 'List Lenses', 'lens');
		Menus.addSubMenuItem('topbar', 'lens', 'New Lens', 'lens/create');
	}
]);

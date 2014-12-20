'use strict';

// Configuring the Articles module
angular.module('lens').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Lens', 'lens', 'dropdown', '/lens(/create)?');
		Menus.addSubMenuItem('topbar', 'lens', 'List Lens', 'lens');
		Menus.addSubMenuItem('topbar', 'lens', 'New Len', 'lens/create');
	}
]);
(function () {
  'use strict';

  angular
    .module('feeds')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Feeds',
      state: 'feeds',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'feeds', {
      title: 'List Feeds',
      state: 'feeds.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'feeds', {
      title: 'Create Feed',
      state: 'feeds.create',
      roles: ['user']
    });
  }
})();

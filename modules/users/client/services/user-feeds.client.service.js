'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('UserFeeds', ['$resource',
  function ($resource) {
    return $resource('api/users/feeds', {}, {
        query:  {method:'GET', isArray:true},
    });
  }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('UserFriends', ['$resource',
  function ($resource) {
    return $resource('api/users/friends', {}, {
        query:  {method:'GET', isArray:true},
    });
  }
]);

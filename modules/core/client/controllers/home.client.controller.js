'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication','NgMap',
  function ($scope, Authentication,NgMap) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    var cMap;
     NgMap.getMap().then(function(map) {
        cMap = map;
        console.log('markers', map.markers);
        console.log('shapes', map.shapes);
      });
      
      $scope.showDetail = function() {
        if(!cMap)
        return;
        cMap.showInfoWindow('foo-iw', 'foo');
      }
  }
]);

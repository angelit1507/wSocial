(function () {
  'use strict';

  // Feeds controller
  angular
    .module('feeds')
    .controller('FeedsController', FeedsController);

  FeedsController.$inject = ['$scope', '$state', 'Authentication', 'feedResolve','FeedActivitiesService'];

  function FeedsController ($scope, $state, Authentication, feed,FeedActivitiesService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.feed = feed;
    vm.error = null;
    vm.form = {};
    vm.commentData = '';
    vm.remove = remove;
    vm.save = save;
    vm.like = like;
    vm.comment = comment;
    
    vm.feed.location = "171 đình phong phú";

    // Remove existing Feed
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.feed.$remove($state.go('feeds.list'));
      }
    }

    // Save Feed
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.feedForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.feed._id) {
        vm.feed.$update(successCallback, errorCallback);
      } else {
        vm.feed.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('feeds.view', {
          feedId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
    
    function like(f){
        FeedActivitiesService.like(f._id).success(function(res){
            
        });
    }
    
    function comment(f){
        FeedActivitiesService.comment(f._id,vm.commentData).success(function(res){
            
        });
    }
  }
})();

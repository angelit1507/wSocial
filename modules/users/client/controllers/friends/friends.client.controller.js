(function() {
    'use strict';

    angular
        .module('users')
        .controller('UserFriendsController', UserFriendsController);

    UserFriendsController.$inject = ['$scope', 'Authentication', 'Users', 'UserFriends', 'FeedsService', 'geolocation'];

    function UserFriendsController($scope, Authentication, Users, UserFriends, Feeds, geolocation) {
        var vm = this;
        vm.friends = [];
        vm.feed = {
            name: '',
            geoLocation: []
        };
        $scope.user = Authentication.user;
        var user = new Users($scope.user);

        $scope.success = $scope.error = null;
        // Feeds controller logic
        // ...

        vm.addFeed = addFeed;

        init();

        function init() {
            console.log('feed init');
            UserFriends.query(function(data) {
                vm.friends = data;
            });
        }

        function addFeed() {
            // Create new Article object
            var feed = new Feeds(vm.feed);

            // Redirect after save
            feed.$save(function(response) {
            });
        }
    }
})();

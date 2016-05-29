(function() {
    'use strict';

    angular
        .module('users')
        .controller('UserFeedsController', UserFeedsController);

    UserFeedsController.$inject = ['$scope', 'Authentication', 'Users', 'UserFeeds', 'FeedsService', 'geolocation'];

    function UserFeedsController($scope, Authentication, Users, UserFeeds, Feeds, geolocation) {
        var vm = this;
        vm.feeds = [];
        vm.feed = {
            name: '',
            geoLocation: []
        };
        $scope.user = Authentication.user;
        var user = new Users($scope.user);
        geolocation.getLocation().then(function(data) {
            console.log(data.coords);
            user.geoLocation = vm.feed.geoLocation = [data.coords.longitude, data.coords.latitude];
            user.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
            }, function(response) {
                $scope.error = response.data.message;
            });
        });

        $scope.$on('error', function(error) {
            console.log('Need accept location...');
        });


        $scope.success = $scope.error = null;
        // Feeds controller logic
        // ...

        vm.addFeed = addFeed;

        init();

        function init() {
            console.log('feed init');
            UserFeeds.query(function(data) {
                vm.feeds = data;
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

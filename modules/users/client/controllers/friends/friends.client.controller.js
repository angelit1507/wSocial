(function () {
    'use strict';

    angular
        .module('users')
        .controller('UserFriendsController', UserFriendsController);

    UserFriendsController.$inject = ['$scope', 'Authentication', 'Users', 'UserFriends', 'FeedsService', 'geolocation', 'NgMap', '$mdDialog'];

    function UserFriendsController($scope, Authentication, Users, UserFriends, Feeds, geolocation, NgMap,$mdDialog) {
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
            UserFriends.query(function (data) {
                vm.friends = data;
            });
        }

        function addFeed() {
            // Create new Article object
            var feed = new Feeds(vm.feed);

            // Redirect after save
            feed.$save(function (response) {
            });
        }



        var cMap;
        vm.users = [
            {
                id: 'a1',
                location: 'ha noi',
                name: 'cuong',
                image: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/12705605_1002716633134624_3109403205310140243_n.jpg?oh=3ffa0f9c43ae93dbdc561ddcf8f7321a&oe=57D150FA'
            },
            {
                id: 'a2',
                location: 'da nang',
                name: 'Phat',
                image: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/13051715_528584543979440_5251276590943707174_n.jpg?oh=4625d09626e615140c926fcc08d3ebfa&oe=57E52A61'
            }, {
                id: 'a3',
                location: 'ho chi minh',
                name: 'My to',
                image: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/13221536_631636140323809_6629689315194987158_n.jpg?oh=f337b8e448ad5ce69a7b166557e05c73&oe=57E0A9F5'
            }
        ];
        NgMap.getMap().then(function (map) {
            cMap = map;
            console.log('markers', map.markers);
            console.log('shapes', map.shapes);
        });

        vm.showDetail = function (user) {
            if (!cMap)
                return;
            cMap.showInfoWindow('foo-iw', user.id);
        };



        vm.showAdd = function (ev) {
            $mdDialog.show({
                controller: 'FeedsController',
                templateUrl: '/modules/feeds/client/views/form-feed.client.view.dialog.html',
                targetEvent: ev,
                controllerAs: 'vm',
                resolve: {
                    feedResolve: newFeed
                },
                data: {
                    roles: ['user', 'admin'],
                    pageTitle : 'Feeds Create'
                    }
                })
                .then(function (answer) {
                    $scope.alert = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.alert = 'You cancelled the dialog.';
                });
        };
        newFeed.$inject = ['FeedsService'];

        function newFeed(FeedsService) {
            return new FeedsService();
        }
    }
})();

//Feeds service used to communicate Feeds REST endpoints
(function() {
    'use strict';

    angular
        .module('feeds')
        .factory('FeedsService', FeedsService);

    FeedsService.$inject = ['$resource'];

    function FeedsService($resource) {
        return $resource('api/feeds/:feedId', {
            feedId: '@_id'
        }, {
                update: {
                    method: 'PUT'
                }
            });
    }

    angular
        .module('feeds')
        .factory('FeedActivitiesService', FeedActivitiesService);

    FeedActivitiesService.$inject = ['$http'];

    function FeedActivitiesService($http) {
        return {
            like: function(feedId) {
                return $http.post('/api/feeds/activities/like/' + feedId, {});
            },
            comment: function(feedId, content) {
                return $http.post('/api/feeds/activities/comment/' + feedId, { content: content });
            }
        };
    }
})();
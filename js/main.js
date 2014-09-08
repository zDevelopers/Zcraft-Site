var zdsdocApp = angular.module('zdsdocApp', ['ngRoute', 'hc.marked']);



zdsdocApp.config(['$routeProvider', 
    function($routeProvider){
        $routeProvider.
            when('/', {
                templateUrl: 'home.html'
            }).
            when('/erreur', {
                templateUrl: 'error.html'
            }).
            when('/:part/:chapter', {
                template: '<div marked="chapter"></div>',
                controller: 'ChapterCtrl'
            }).
            otherwise({
                redirectTo: '/erreur'
            })
    }
]);



zdsdocApp.controller('IndexCtrl', ['$scope', '$http',
    function($scope, $http){
        $http.get('src-doc/manifest.json').success(function(data){
            $scope.summary = data;
        });
    }
]);



zdsdocApp.controller('ChapterCtrl', ['$scope', '$routeParams', '$http', '$location',
    function($scope, $routeParams, $http, $location){
        $http.get('src-doc/' + $routeParams.part + '/' + $routeParams.chapter + '.md')
        .success(function(data){
            $scope.chapter = data;
        })
        .error(function(data){
            $location.url('/erreur');
        });
    }
]);
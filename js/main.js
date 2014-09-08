var zdsdocApp = angular.module('zdsdocApp', ['ngRoute']);



zdsdocApp.config(['$routeProvider', 
    function($routeProvider){
        $routeProvider.
            when('/:part/:chapter', {
                template: '{{ chapter }}',
                controller: 'ChapterCtrl'
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



zdsdocApp.controller('ChapterCtrl', ['$scope', '$routeParams', '$http',
    function($scope, $routeParams, $http){
        $http.get('src-doc/' + $routeParams.part + '/' + $routeParams.chapter + '.md').success(function(data){
            $scope.chapter = data;
        });
    }
]);
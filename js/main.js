var zdsdocApp = angular.module('zdsdocApp', ['ngRoute', 'hc.marked']);



zdsdocApp.config(['$routeProvider', 
    function($routeProvider){
        $routeProvider.
            when('/', {
                templateUrl: 'home.html',
                controller: 'HomeCtrl'
            }).
            when('/erreur', {
                templateUrl: 'error.html',
                controller: 'ErrorCtrl'
            }).
            when('/:part/:chapter', {
                template: '<div marked="chapter"></div>',
                controller: 'ChapterCtrl'
            }).
            otherwise({
                redirectTo: '/erreur'
            });
    }
]);



zdsdocApp.controller('IndexCtrl', ['$rootScope', '$scope', '$http',
    function($rootScope, $scope, $http){
        $http.get('src-doc/manifest.json').success(function(data){
            $rootScope.summary = data;
        });
    }
]);



zdsdocApp.controller('HomeCtrl', ['$rootScope',
    function($rootScope){
        $rootScope.breadcrumb = [];
    }
]);



zdsdocApp.controller('ErrorCtrl', ['$rootScope',
    function($rootScope){
        $rootScope.breadcrumb = ["Erreur"];
    }
]);



zdsdocApp.controller('ChapterCtrl', ['$rootScope', '$scope', '$routeParams', '$http', '$location',
    function($rootScope, $scope, $routeParams, $http, $location){
        var file = $routeParams.part + '/' + $routeParams.chapter + '.md';
        $http.get('src-doc/' + file)
        .success(function(data){
            $scope.chapter = data;
            $rootScope.breadcrumb = [];

            for(var p in $rootScope.summary){
                var part = $rootScope.summary[p];
                for(var c in part.chapters){
                    var chapter = part.chapters[c];
                    if(chapter.file === file)
                        $rootScope.breadcrumb.push(part.title, chapter.title);
                }
            }
        })
        .error(function(data){
            $location.url('/erreur');
        });
    }
]);
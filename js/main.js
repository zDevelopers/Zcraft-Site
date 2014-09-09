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
            when('/interface-utilisateur/icones', {
                templateUrl: 'icons.html',
                controller: 'ChapterCtrl'
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
zdsdocApp.config(['markedProvider', function(markedProvider) {
    markedProvider.setOptions({
        highlight: function(code){
            return hljs.highlightAuto(code).value;
        }
    });
}]);



zdsdocApp.controller('IndexCtrl', ['$rootScope', '$scope', '$http',
    function($rootScope, $scope, $http){
        $http.get('src-doc/manifest.json')
        .success(function(data){
            $rootScope.summary = data;
        });
        $http.get('src-doc/icons.json')
        .success(function(data){
            $rootScope.icons = data;
        });
    }
]);



zdsdocApp.controller('HomeCtrl', ['$rootScope',
    function($rootScope){
        $rootScope.breadcrumb = [];
        $rootScope.editable = false;
    }
]);



zdsdocApp.controller('ErrorCtrl', ['$rootScope',
    function($rootScope){
        $rootScope.breadcrumb = ["Erreur"];
        $rootScope.editable = false;
    }
]);



zdsdocApp.controller('ChapterCtrl', ['$rootScope', '$scope', '$routeParams', '$http', '$location',
    function($rootScope, $scope, $routeParams, $http, $location){
        if($routeParams.part === undefined){
            $routeParams.part = 'interface-utilisateur';
            $routeParams.chapter = 'icones';
        }

        var file = $routeParams.part + '/' + $routeParams.chapter + '.md';
        $rootScope.filePath = file;

        $http.get('src-doc/' + file)
        .success(function(data){
            $scope.chapter = data;
            $rootScope.editable = true;
            var breadcrumb = [];

            for(var p in $rootScope.summary){
                var part = $rootScope.summary[p];
                for(var c in part.chapters){
                    var chapter = part.chapters[c];
                    if(part.folder + '/' + chapter.file + '.md' === file)
                        breadcrumb.push(part.title, chapter.title);
                }
            }

            $rootScope.breadcrumb = breadcrumb;
        })
        .error(function(data){
            $location.url('/erreur');
        });
    }
]);